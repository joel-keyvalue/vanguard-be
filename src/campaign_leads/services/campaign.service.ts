import { Injectable } from '@nestjs/common';
import { CampaignRepository } from '../repositories/campaign.repository';
import { Campaign } from '../entities/campaign.entity';
import Pagination from '../../common/utils/pagination';
import { CampaignLead } from '../entities/campaignLead.entity';
import { CreateCampaignDto } from 'campaign_leads/dtos/createCampaign.dto';

@Injectable()
export class CampaignService {
  constructor(private readonly campaignRepository: CampaignRepository) {}

  getHello(): string {
    return 'Hello World!';
  }

  async createCampaign(body: CreateCampaignDto): Promise<Campaign> {
    const campaign = this.campaignRepository.createCampaignEntity(body);
    return this.campaignRepository.createCampaign(campaign);
  }

  async findOne(id: string): Promise<Campaign> {
    return this.campaignRepository.findOne(id);
  }

  async findAll(): Promise<Pagination<Campaign>> {
    return this.campaignRepository.findAll();
  }

  async update(id: string, updates: Partial<Campaign>): Promise<Campaign> {
    return this.campaignRepository.update(id, updates);
  }

  async findOneCampaignLead(id: string): Promise<CampaignLead> {
    return this.campaignRepository.findOneCampaignLead(id);
  }

  async findAllCampaignLeads(): Promise<Pagination<CampaignLead>> {
    return this.campaignRepository.findAllCampaignLeads();
  }

  async updateCampaignLead(
    id: string,
    updates: Partial<CampaignLead>,
  ): Promise<CampaignLead> {
    return this.campaignRepository.updateCampaignLead(id, updates);
  }
}
