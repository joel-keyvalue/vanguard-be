import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';
import { CreateCampaignLeadDto } from './createCampaignLeads.dto';

export class CreateCampaignDto {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateCampaignLeadDto)
  campaignLeads: CreateCampaignLeadDto[];
}
