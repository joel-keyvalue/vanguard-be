import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmailController } from './controllers/email.controller';
import { EmailService } from './services/email.service';
import { ChatModule } from 'chat/chat.module';
import { CampaignLeadsModule } from 'campaign_leads/campaign_leads.module';
import { EmailRepository } from './repositories/email.repository';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ChatModule,
    forwardRef(() => CampaignLeadsModule),
  ],
  controllers: [EmailController],
  providers: [EmailService, EmailRepository],
  exports: [EmailService],
})
export class EmailModule {}
