import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import * as fs from 'fs';
import * as path from 'path';
import { ChatService } from 'chat/services/chat.service';
import { CampaignService } from 'campaign_leads/services/campaign.service';

@Injectable()
export class EmailService {
  private oAuth2Client: OAuth2Client;

  constructor(
    private readonly chatService: ChatService,
    private readonly campaignService: CampaignService
  ) {
    // const credentials = JSON.parse(
    //   fs.readFileSync('src/credentials.json', 'utf8')
    // );

    // const { client_id, client_secret, redirect_uris } = credentials.web;
    // this.oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    //   const token = {};
    //   this.oAuth2Client.setCredentials(token);
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

  async storeChatEntry(threadId: string): Promise<any> {
    const thread = await this.chatService.findOneChatThread(threadId);
    const lead = await this.campaignService.findOneCampaignLead(thread.subjectId); 
    
    return this.chatService.createChat({
      message: "Email opened", 
      metaData: {},
      messageType: "email_opened",
      senderName: lead.name,
      senderType: "campaign_lead",
      threadId: threadId,  
    });
  }

  async readEmails(): Promise<any[]> {
    const gmail = google.gmail({ version: 'v1', auth: this.oAuth2Client });
    const res = await gmail.users.threads.list({ userId: 'me', maxResults: 1 });
    const threads = res.data.threads || [];

    const messages = await Promise.all(threads.map(async (thread) => {
      const threadDetails = await gmail.users.threads.get({ userId: 'me', id: thread.id });
      const threadMessages = threadDetails.data.messages || [];

      return threadMessages.map(message => {
        const parts = message.payload?.parts || [];
        const body = parts.length ? parts[0].body?.data : message.payload?.body?.data;
        const decodedBody = body ? Buffer.from(body, 'base64').toString('utf-8') : 'No Content';

        const headers = message.payload?.headers || [];
        const fromHeader = headers.find(header => header.name === 'From');
        const fromAddress = fromHeader ? fromHeader.value : 'No From Address';
        const subjectHeader = headers.find(header => header.name === 'Subject');

        return {
          id: message.id,
          threadId: message.threadId,
          snippet: message.snippet,
          body: decodedBody,
          from: fromAddress
        };
      });
    }));

    return messages.flat();
  }
}
