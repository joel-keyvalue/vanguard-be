import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CampaignLeadsModule } from './campaign_leads/campaign_leads.module';
import { typeormConfigFactory } from './typeorm/typeorm.config';
import { ChatModule } from 'chat/chat.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [],
      inject: [],
      useFactory: typeormConfigFactory,
    }),
    CampaignLeadsModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
