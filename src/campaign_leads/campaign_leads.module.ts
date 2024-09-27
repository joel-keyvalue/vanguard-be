import { Module } from '@nestjs/common';
import { CampaignController } from './controllers/campaign.controller';
import { CampaignService } from './services/campaign.service';
import { CampaignRepository } from './repositories/campaign.repository';

@Module({
  controllers: [CampaignController],
  providers: [CampaignService, CampaignRepository],
})
export class CampaignLeadsModule {}
