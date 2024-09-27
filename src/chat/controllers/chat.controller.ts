import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { ChatService } from '..//services/chat.service';

@Controller('chats')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  //pass subject id filter
  @Get('threads')
  async findAllChatThreads(@Query('subjectId') subjectId?: string) {
    return this.chatService.findAllChatThreads(subjectId);
  }

  @Get(':threadId')
  async findAllChatsInThread(
    @Param('threadId', new ParseUUIDPipe()) threadId: string,
  ) {
    return this.chatService.findAllChatsInThread(threadId);
  }

  // @Post()
  // async createCampaign() {
  //   return;
  //   //this.campaignService.createCampaign(body);
  // }
}
