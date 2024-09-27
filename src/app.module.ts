import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CampaignLeadsModule } from './campaign_leads/campaign_leads.module';
import { typeormConfigFactory } from './typeorm/typeorm.config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [],
      inject: [],
      useFactory: typeormConfigFactory,
    }),
    CampaignLeadsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
