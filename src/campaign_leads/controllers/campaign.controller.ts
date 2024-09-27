import { Body, Controller, Get, Post } from '@nestjs/common';
import { CampaignService } from '../services/campaign.service';
import { CreateCampaignDto } from 'campaign_leads/dtos/createCampaign.dto';

@Controller('campaign')
export class CampaignController {
  constructor(private readonly campaignService: CampaignService) {}

  @Get()
  async findAllCampaign() {
    return this.campaignService.findAll();
  }

  @Get('leads')
  async findAllCampaignLeads() {
    return this.campaignService.findAllCampaignLeads();
  }

  @Post()
  async createCampaign(@Body() body: CreateCampaignDto) {
    return this.campaignService.createCampaign(body);
  }
}
