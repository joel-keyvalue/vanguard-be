import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import * as fs from 'fs';
import * as path from 'path';
import { ChatService } from 'chat/services/chat.service';
import { CampaignService } from 'campaign_leads/services/campaign.service';
import * as dotenv from 'dotenv';
import { Email } from 'email/entities/email.entity';
import { EmailRepository } from 'email/repositories/email.repository';

@Injectable()
export class EmailService {
  private oAuth2Client: OAuth2Client;

  constructor(
    private readonly chatService: ChatService,
    @Inject(forwardRef(() => CampaignService))
    private readonly campaignService: CampaignService,
    private readonly emailRepository: EmailRepository,
  ) {
    const credentials = JSON.parse(
      fs.readFileSync('src/credentials.json', 'utf8')
    );

    const { client_id, client_secret, redirect_uris } = credentials.web;
    this.oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    const token = JSON.parse(process.env.GOOGLE_TOKEN);
    console.log(token);
    this.oAuth2Client.setCredentials(token);
  }

  async checkAvailability(emailAddresses: string[], timeMin: string, timeMax: string): Promise<any> {
    const calendar = google.calendar({ version: 'v3', auth: this.oAuth2Client });
    const res = await calendar.freebusy.query({
        requestBody: {
          timeMin: timeMin,
          timeMax: timeMax,
          items: emailAddresses.map(email => ({ id: email }))
        }
      });
    
      const busyTimes = res.data.calendars;
      const available = emailAddresses.every(email => !busyTimes[email].busy.length);
      
      if (available) {
        const event = {
            summary: 'Scheduled Meeting',
            start: {
              dateTime: timeMin,
              timeZone: 'America/Los_Angeles'
            },
            end: {
              dateTime: timeMax,
              timeZone: 'America/Los_Angeles'
            },
            attendees: emailAddresses.map(email => ({ email })),
            conferenceData: {
              createRequest: {
                requestId: 'sample123',
                conferenceSolutionKey: {
                  type: 'hangoutsMeet'
                }
              }
            }
          };
        
        const res = await calendar.events.insert({
            calendarId: 'primary',
            requestBody: event,
            conferenceDataVersion: 1,
            sendUpdates: 'all' 
          });
          console.log('Event created: %s', res.data.htmlLink);
      } else {
        console.log('One or more attendees are not available at the requested time.');
      }
      
      return res.data;
        
  }

  async storeChatEntry(emailId: string): Promise<any> {
    const email = await this.emailRepository.findOneEmail(emailId);
    if (!email || !email.threadId) {
      return;
    }
    const thread = await this.chatService.findOneChatThread(email.threadId);
    const lead = await this.campaignService.findOneCampaignLead(thread.subjectId); 
    await this.emailRepository.update(emailId, { status: 'read' });
    return this.chatService.createChat({
      message: "Email opened", 
      metaData: {},
      messageType: "email_opened",
      senderName: lead.name,
      senderType: "campaign_lead",
      threadId: email.threadId,  
    });
  }

  async storeScheduleEntry(lead: any, treadId: any): Promise<any> {
    return this.chatService.createChat({
      message: `Schedule a Meeting for 30 minutes with ${lead.name} on 2024-09-28 at 2:30 PM`, 
      metaData: {},
      messageType: "meeting_scheduled",
      senderName: "Sales Genie",
      senderType: "chatbot",
      threadId: treadId,  
    });
  }

  async readEmails(emailId: string): Promise<any> {
    const email = await this.emailRepository.findOneEmail(emailId);

    const thread = await this.chatService.findOneChatThread(email.threadId);
    const lead = await this.campaignService.findOneCampaignLead(thread.subjectId);

    const gmail = google.gmail({ version: 'v1', auth: this.oAuth2Client });
    const messages = await gmail.users.messages.list({ userId: 'me', q: `from:${lead.email}`, maxResults: 1 });
    if (messages.data.messages) {
      const allMessages = messages.data.messages;
      const messageId = allMessages[allMessages.length - 1].id;
      const message = (await gmail.users.messages.get({ userId: 'me', id: messageId })).data;
      const parts = message.payload?.parts || [];
      const body = parts.length ? parts[0].body?.data : message.payload?.body?.data;
      var decodedBody = body ? Buffer.from(body, 'base64').toString('utf-8') : 'No Content';
      const replySeparator = decodedBody.indexOf('On Sat'); 
      if (replySeparator !== -1) {
        decodedBody = decodedBody.substring(0, replySeparator).trim();
      }

      const action = await this.campaignService.requestAction(decodedBody);
      if(action == 'SCHEDULE_A_MEETING') {
        const calendar = google.calendar({ version: 'v3', auth: this.oAuth2Client });
        const emailAddresses = [lead.email];
        const event = {
          summary: 'Product Demo',
          start: {
            dateTime: '2024-09-28T09:00:00Z',
            timeZone: 'America/Los_Angeles'
          },
          end: {
            dateTime: '2024-09-28T09:30:00Z',
            timeZone: 'America/Los_Angeles'
          },
          attendees: emailAddresses.map(email => ({ email })),
          conferenceData: {
            createRequest: {
              requestId: messageId,
              conferenceSolutionKey: {
                type: 'hangoutsMeet'
              }
            }
          }
        };

        calendar.events.insert({
          calendarId: 'primary',
          requestBody: event,
          conferenceDataVersion: 1,
          sendUpdates: 'all' 
        });
        
        return this.storeScheduleEntry(lead, thread.id);
      }
    } 
    return;
  }

  async createEmail(email: Partial<Email>): Promise<Email> {
    return this.emailRepository.createEmail(email);
  }

  async findOneEmail(id: string): Promise<Email> {
    return this.emailRepository.findOneEmail(id);
  }

  async update(id: string, updates: Partial<Email>): Promise<Email> {
    return this.emailRepository.update(id, updates);
  }
}
