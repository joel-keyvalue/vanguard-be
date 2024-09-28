import { Controller, Get, Next, Param, Res } from '@nestjs/common';
import { EmailService } from '../services/email.service';
import { NextFunction, Response } from "express";
import { ChatService } from 'chat/services/chat.service';


@Controller('email')
export class EmailController {
  constructor(
    private readonly emailService: EmailService
  ) {}

  @Get('open/:id')
  async getTracker(
    @Param('id') id: string,
    @Res() res: Response,
    @Next() next: NextFunction
  ) {
    try {
      this.emailService.storeChatEntry(id)

      setTimeout(async () => {
        try {
          return await this.emailService.readEmails(id);
          } catch (error) {
          console.error('Error checking for mail from user', error);
        }
      }, 60000); // 60000 milliseconds = 1 minute

      // Send an immediate response
      res.status(200).send('Tracker received');
    } catch (error) {
      next(error);
    }
  }
  

  // @Get()
  // async getEmails() {
  //   return this.emailService.readEmails();
  // }

  // @Get("schedule")
  // async scheduleMeeting() {
  //   return this.emailService.checkAvailability(["msherifkk@gmail.com", "sherif@keyvalue.systems"], "2024-09-28T00:00:00Z", "2024-09-28T01:00:00Z");
  // }
}