import { Module } from '@nestjs/common';
import { ChatService } from './services/chat.service';
import { ChatRepository } from './repositories/chat.repository';
import { ChatController } from './controllers/chat.controller';

@Module({
  controllers: [ChatController],
  providers: [ChatService, ChatRepository],
})
export class ChatModule {}
