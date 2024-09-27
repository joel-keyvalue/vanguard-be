import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CampaignLeadStatus } from '../constants/campaignLeadStatus';
import { Campaign } from './campaign.entity';
import { BaseEntity } from '../../common/classes/baseEntity';

@Entity()
export class CampaignLead extends BaseEntity {
  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  company: string;

  @Column({ nullable: true })
  jobTitle: string;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  score: string;

  @Column({ nullable: true })
  linkedIn: string;

  @Column({ nullable: true })
  company_website: string;

  @Column({ nullable: true })
  industry: string;

  @Column({ nullable: true })
  phone: string;

  @Column('uuid', { nullable: true })
  campaignId: string;

  @ManyToOne(() => Campaign)
  @JoinColumn({ referencedColumnName: 'id', name: 'campaign_id' })
  campaign: Campaign;

  @Column({ nullable: true, default: CampaignLeadStatus.COLD })
  status: CampaignLeadStatus;
}
