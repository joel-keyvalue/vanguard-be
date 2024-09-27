import { Module } from '@nestjs/common';
import { CampaignController } from './controllers/campaign.controller';
import { CampaignService } from './services/campaign.service';
import { CampaignRepository } from './repositories/campaign.repository';
import { ChatModule } from 'chat/chat.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [CampaignController],
  exports: [CampaignService],
  imports: [ChatModule, HttpModule],
  providers: [CampaignService, CampaignRepository],
})
export class CampaignLeadsModule {}
