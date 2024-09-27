import { Column, Entity, OneToMany, Timestamp } from 'typeorm';
import { BaseEntity } from '../../common/classes/baseEntity';
import { CampaignLead } from './campaignLead.entity';

@Entity()
export class Campaign extends BaseEntity {
  @Column()
  name: string;

  @Column({ type: 'timestamp' })
  scheduleTime: Date;
  
  @Column()
  status: string;  

  @OneToMany(() => CampaignLead, (campaignLead) => campaignLead.campaign, {
    cascade: ['insert'],
  })
  campaignLeads: CampaignLead[];
}
