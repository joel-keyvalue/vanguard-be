import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmailController } from './controllers/email.controller';
import { EmailService } from './services/email.service';
import { Chat } from 'chat/entities/chat.entity';
import { ChatModule } from 'chat/chat.module';
import { Campaign } from 'campaign_leads/entities/campaign.entity';
import { CampaignLead } from 'campaign_leads/entities/campaignLead.entity';
import { CampaignLeadsModule } from 'campaign_leads/campaign_leads.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ChatModule,
    CampaignLeadsModule,
  ],
  controllers: [EmailController],
  providers: [EmailService],
})
export class EmailModule {}