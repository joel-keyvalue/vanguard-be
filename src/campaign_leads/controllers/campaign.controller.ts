import { Body, Controller, Get, Post } from '@nestjs/common';
import { CampaignService } from '../services/campaign.service';

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
}
