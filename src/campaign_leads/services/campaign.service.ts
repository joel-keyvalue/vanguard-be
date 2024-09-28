import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CampaignRepository } from '../repositories/campaign.repository';
import { Campaign } from '../entities/campaign.entity';
import Pagination from '../../common/utils/pagination';
import { CampaignLead } from '../entities/campaignLead.entity';
import { CreateCampaignDto } from 'campaign_leads/dtos/createCampaign.dto';
import { Cron, CronExpression } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';
import { ChatService } from 'chat/services/chat.service';
import { lastValueFrom } from 'rxjs';
import { EmailService } from 'email/services/email.service';
import { replaceTemplate } from 'email/utils';
import { Templates } from 'email/constants/templates';

@Injectable()
export class CampaignService {
  constructor(
    private readonly campaignRepository: CampaignRepository,
    private readonly chatService: ChatService,
    private readonly httpService: HttpService,
    @Inject(forwardRef(() => EmailService))
    private readonly emailService: EmailService,
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
        const email = await this.emailService.createEmail({
          message: replaceTemplate(Templates.INITIAL, {
            name: lead.name,
          }),
          threadId: thread.id,
        });

        // Prepare the data for the API call
        const data = {
          workflowName: 'Introduction',
          data: {},
          notify: {
            variables: {
              name: lead.name,
              messageId: email.id,
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

  async sendFollowUpEmail(threadId: string): Promise<any> {
    const thread = await this.chatService.findOneChatThread(threadId);
    const lead = await this.findOneCampaignLead(thread.subjectId);
    const email = await this.emailService.createEmail({
      message: replaceTemplate(Templates.FOLLOW_UP, {
        name: lead.name,
      }),
      type: 'followup',
      threadId: thread.id,
    });
    if (email.type !== 'initial') {
      return;
    }
    const data = {
      workflowName: 'FollowUp',
      data: {},
      notify: {
        variables: {
          name: lead.name,
          messageId: email.id,
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
      await this.storeFollowupChatEntry(thread.id, response.data);
    } catch (error) {
      console.error('Error sending email to lead', lead.email, error);
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

  private async storeFollowupChatEntry(threadId: string, data: any): Promise<any> {
    return this.chatService.createChat({
      message: "Hey! Look like @::name:: has opened the email but not responded. Follow up email sent.", 
      metaData: {
        header: "Checking in on Our AI Solutions – Let’s Connect",
        button: "View Email",
      },
      messageType: "email_sent",
      senderName: "Sales Genie",
      senderType: "chatbot",
      threadId: threadId,  
    });
  }
}
