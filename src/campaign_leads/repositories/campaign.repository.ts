import { Injectable } from '@nestjs/common';
import { DataSource, DeepPartial, Repository } from 'typeorm';
import Pagination from '../../common/utils/pagination';
import { Campaign } from '../entities/campaign.entity';
import { CampaignLead } from '../entities/campaignLead.entity';
import { SortOrder } from '../../common/constants/sortOrder';

@Injectable()
export class CampaignRepository {
  protected campaignRepository: Repository<Campaign>;
  protected leadRepository: Repository<CampaignLead>;

  constructor(dataSource: DataSource) {
    this.campaignRepository = dataSource.getRepository(Campaign);
    this.leadRepository = dataSource.getRepository(CampaignLead);
  }

  createCampaignEntity(campaign: DeepPartial<Campaign>) {
    return this.campaignRepository.create(campaign);
  }

  async createCampaign(campaign: Partial<Campaign>): Promise<Campaign> {
    return this.campaignRepository.save(campaign);
  }

  async findOne(id: string): Promise<Campaign> {
    return this.campaignRepository.findOne({ where: { id } });
  }

  async findAll(): Promise<Pagination<Campaign>> {
    const { page, pageSize, sortBy, sortOrder, search } = {
      page: 0,
      pageSize: 25,
      sortBy: 'createdAt',
      sortOrder: SortOrder.DESC,
      search: '',
    };
    const qb = this.campaignRepository.createQueryBuilder('campaign');
    qb.take(25);
    qb.skip(0 * pageSize);
    qb.orderBy(`campaign.${sortBy}`, sortOrder);
    if (search) {
      qb.andWhere('(campaign.name ILike :q)', { q: `%${search}%` });
    }
    const [campaigns, total] = await qb.getManyAndCount();
    return new Pagination<Campaign>(campaigns, page, pageSize, total);
  }

  async findCampaign(scheduleTime: Date): Promise<Campaign[]> {
    const qb = this.campaignRepository.createQueryBuilder('campaign');
    qb.orderBy(`campaign.schedule_time`, 'ASC');
    qb.where('campaign.schedule_time <= :scheduleTime and campaign.status = :status', { scheduleTime, status: 'scheduled' });
    return await qb.getMany();
  }

  async update(id: string, updates: Partial<Campaign>): Promise<Campaign> {
    return this.campaignRepository.save({ id, ...updates });
  }

  async findOneCampaignLead(id: string): Promise<CampaignLead> {
    return this.leadRepository.findOne({ where: { id } });
  }

  async findAllLeads(campaignId: String): Promise<CampaignLead[]> {
    const qb = this.leadRepository.createQueryBuilder('campaignLead');
    qb.orderBy(`campaignLead.createdAt`, 'DESC');
    qb.where('campaignLead.campaignId = :campaignId', { campaignId });
    return await qb.getMany();
  }

  async findAllCampaignLeads(): Promise<Pagination<CampaignLead>> {
    const { page, pageSize, sortBy, sortOrder, search } = {
      page: 0,
      pageSize: 25,
      sortBy: 'createdAt',
      sortOrder: SortOrder.DESC,
      search: '',
    };

    const qb = this.leadRepository.createQueryBuilder('campaignLead');
    qb.take(25);
    qb.skip(0 * pageSize);
    qb.orderBy(`campaignLead.${sortBy}`, sortOrder);
    if (search) {
      qb.andWhere('(campaignLead.name ILike :q)', { q: `%${search}%` });
    }
    const [leads, total] = await qb.getManyAndCount();
    return new Pagination<CampaignLead>(leads, page, pageSize, total);
  }

  async updateCampaignLead(
    id: string,
    updates: Partial<CampaignLead>,
  ): Promise<CampaignLead> {
    return this.leadRepository.save({ id, ...updates });
  }
}
