import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CampaignLeadsModule } from './campaign_leads/campaign_leads.module';
import { typeormConfigFactory } from './typeorm/typeorm.config';
import { ChatModule } from 'chat/chat.module';
import { ImageModule } from './image/image.module';
import { EmailModule } from './email/email.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [],
      inject: [],
      useFactory: typeormConfigFactory,
    }),
    ScheduleModule.forRoot(),
    CampaignLeadsModule,
    ChatModule,
    ImageModule,
    EmailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
