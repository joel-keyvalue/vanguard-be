import { Injectable } from '@nestjs/common';
import { CampaignRepository } from '../repositories/campaign.repository';
import { Campaign } from '../entities/campaign.entity';
import Pagination from '../../common/utils/pagination';
import { CampaignLead } from '../entities/campaignLead.entity';
import { CreateCampaignDto } from 'campaign_leads/dtos/createCampaign.dto';
import { Cron, CronExpression } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';
import { ChatRepository } from 'chat/repositories/chat.repository';
import { ChatService } from 'chat/services/chat.service';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class CampaignService {
  constructor(
    private readonly campaignRepository: CampaignRepository,
    private readonly chatService: ChatService,
    private readonly httpService: HttpService
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async createCampaign(body: CreateCampaignDto): Promise<Campaign> {
    const campaign = this.campaignRepository.createCampaignEntity(body);
    return this.campaignRepository.createCampaign(campaign);
  }

  async findOne(id: string): Promise<Campaign> {
    return this.campaignRepository.findOne(id);
  }

  async findAll(): Promise<Pagination<Campaign>> {
    return this.campaignRepository.findAll();
  }

  async findCampaign(scheduleTime: Date): Promise<Campaign[]> {
    return this.campaignRepository.findCampaign(scheduleTime);
  }

  async update(id: string, updates: Partial<Campaign>): Promise<Campaign> {
    return this.campaignRepository.update(id, updates);
  }

  async findOneCampaignLead(id: string): Promise<CampaignLead> {
    return this.campaignRepository.findOneCampaignLead(id);
  }

  async findAllCampaignLeads(): Promise<Pagination<CampaignLead>> {
    return this.campaignRepository.findAllCampaignLeads();
  }

  async updateCampaignLead(
    id: string,
    updates: Partial<CampaignLead>,
  ): Promise<CampaignLead> {
    return this.campaignRepository.updateCampaignLead(id, updates);
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async checkAndTriggerCampaigns(): Promise<void> {
    console.log('Checking and triggering campaigns');
    const now = new Date();
    const campaigns = await this.findCampaign(now);

    for (const campaign of campaigns) {
      const leads = await this.campaignRepository.findAllLeads(campaign.id);
      for (const lead of leads) {
        console.log('Sending email to lead', lead.email, lead.name);

        // Create a thread for the lead
        const thread = await this.createThreadForLead(lead);

        // Prepare the data for the API call
        const data = {
          workflowName: 'Introduction',
          data: {},
          notify: {
            variables: {
              name: lead.name,
              messageId: thread.id,
            },
            email: lead.email,
          },
        };

        // Make the API call to send the email
        try {
          const response = await lastValueFrom(
            this.httpService.post('https://api.trysiren.io/api/v2/workflows/trigger', data, {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer 9ce050d7ef384aaea9af679e340025b1',
              },
            }),
          );

          // Store the response as a chat entry
          await this.storeChatEntry(thread.id, response.data);
        } catch (error) {
          console.error('Error sending email to lead', lead.email, error);
        }
      }
      
      // Update the campaign status
      await this.update(campaign.id, {status: 'completed'});
    }
  }

  private async createThreadForLead(lead: any): Promise<any> {
    return this.chatService.createChatThread({subjectType: "campaign_lead", subjectId: lead.id});
  }

  private async storeChatEntry(threadId: string, data: any): Promise<any> {
    return this.chatService.createChat({
      message: "Email sent", 
      metaData: {
        header: "Introduction to Our AI-Powered Solutions",
        button: "View Email",
      },
      messageType: "email_sent",
      senderName: "Sales Genie",
      senderType: "chatbot",
      threadId: threadId,  
    });
  }
}
