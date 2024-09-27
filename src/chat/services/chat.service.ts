import { Injectable } from '@nestjs/common';
import { ChatThread } from '../entities/chatThread.entity';
import Pagination from '../../common/utils/pagination';
import { Chat } from '../entities/chat.entity';
import { ChatRepository } from '../repositories/chat.repository';

@Injectable()
export class ChatService {
  constructor(private readonly chatRepository: ChatRepository) {}

  getHello(): string {
    return 'Hello World!';
  }

  // async createChatThread(): Promise<ChatThread> {
  //   return;
  // }

  async findOneChatThread(id: string): Promise<ChatThread> {
    return this.chatRepository.findOneChatThread(id);
  }

  async findAllChatThreads(
    subjectId?: string,
  ): Promise<Pagination<ChatThread>> {
    return this.chatRepository.findAllChatThreads(subjectId);
  }

  // async update(id: string, updates: Partial<ChatThread>): Promise<ChatThread> {
  //   return this.chatRepository.update(id, updates);
  // }

  async findOneChat(id: string): Promise<Chat> {
    return this.chatRepository.findOneChat(id);
  }

  async findAllChatsInThread(threadId: string): Promise<Pagination<Chat>> {
    return this.chatRepository.findAllChatsInThread(threadId);
  }

  //   async updateChat(id: string, updates: Partial<Chat>): Promise<Chat> {
  //     return this.chatRepository.updateChat(id, updates);
  //   }
}
