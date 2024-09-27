import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCampaignLeadDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  email: string;

  @IsOptional()
  company: string;

  @IsOptional()
  jobTitle: string;
}
