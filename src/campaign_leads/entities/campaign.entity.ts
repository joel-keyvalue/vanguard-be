import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/classes/baseEntity';
import { CampaignLead } from './campaignLead.entity';

@Entity()
export class Campaign extends BaseEntity {
  @Column()
  name: string;

  @OneToMany(() => CampaignLead, (campaignLead) => campaignLead.campaign, {
    cascade: ['insert'],
  })
  campaignLeads: CampaignLead[];
}
