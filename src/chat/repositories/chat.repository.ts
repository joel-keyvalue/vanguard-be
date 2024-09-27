import { Injectable } from '@nestjs/common';
import { DataSource, DeepPartial, Repository } from 'typeorm';
import Pagination from '../../common/utils/pagination';
import { ChatThread } from '../entities/chatThread.entity';
import { Chat } from '../entities/chat.entity';
import { SortOrder } from '../../common/constants/sortOrder';

@Injectable()
export class ChatRepository {
  protected chatThreadRepository: Repository<ChatThread>;
  protected chatRepository: Repository<Chat>;

  constructor(dataSource: DataSource) {
    this.chatThreadRepository = dataSource.getRepository(ChatThread);
    this.chatRepository = dataSource.getRepository(Chat);
  }

  createChatThreadEntity(chatThread: DeepPartial<ChatThread>) {
    return this.chatThreadRepository.create(chatThread);
  }

  async createChatThread(chatThread: Partial<ChatThread>): Promise<ChatThread> {
    return this.chatThreadRepository.save(chatThread);
  }

  async findOneChatThread(id: string): Promise<ChatThread> {
    return this.chatThreadRepository.findOne({ where: { id } });
  }

  async findAllChatThreads(
    subjectId?: string,
  ): Promise<Pagination<ChatThread>> {
    const { page, pageSize, sortBy, sortOrder } = {
      page: 0,
      pageSize: 25,
      sortBy: 'createdAt',
      sortOrder: SortOrder.DESC,
    };
    const qb = this.chatThreadRepository.createQueryBuilder('chatThread');
    if (subjectId) {
      qb.andWhere('(chatThread.subjectId = :subjectId)', { subjectId });
    }

    qb.take(25);
    qb.skip(0 * pageSize);
    qb.orderBy(`chatThread.${sortBy}`, sortOrder);

    const [chatThreads, total] = await qb.getManyAndCount();
    return new Pagination<ChatThread>(chatThreads, page, pageSize, total);
  }

  async update(id: string, updates: Partial<ChatThread>): Promise<ChatThread> {
    return this.chatThreadRepository.save({ id, ...updates });
  }

  async findOneChat(id: string): Promise<Chat> {
    return this.chatRepository.findOne({ where: { id } });
  }

  async findAllChatsInThread(threadId: string): Promise<Pagination<Chat>> {
    const { page, pageSize, sortBy, sortOrder } = {
      page: 0,
      pageSize: 100,
      sortBy: 'createdAt',
      sortOrder: SortOrder.ASC,
    };

    const qb = this.chatRepository.createQueryBuilder('chat');
    if (threadId) {
      qb.andWhere('(chat.threadId = :threadId)', { threadId });
    }
    qb.take(25);
    qb.skip(0 * pageSize);
    qb.orderBy(`chat.${sortBy}`, sortOrder);

    const [leads, total] = await qb.getManyAndCount();
    return new Pagination<Chat>(leads, page, pageSize, total);
  }

  //   async updateChat(id: string, updates: Partial<Chat>): Promise<Chat> {
  //     return this.chatRepository.save({ id, ...updates });
  //   }
}
