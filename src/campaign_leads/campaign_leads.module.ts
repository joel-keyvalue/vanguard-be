import { forwardRef, Module } from '@nestjs/common';
import { CampaignController } from './controllers/campaign.controller';
import { CampaignService } from './services/campaign.service';
import { CampaignRepository } from './repositories/campaign.repository';
import { ChatModule } from 'chat/chat.module';
import { HttpModule } from '@nestjs/axios';
import { EmailModule } from 'email/email.module';

@Module({
  controllers: [CampaignController],
  exports: [CampaignService],
  imports: [ChatModule, HttpModule, forwardRef(() => EmailModule)],
  providers: [CampaignService, CampaignRepository],
})
export class CampaignLeadsModule {}
