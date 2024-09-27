import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/classes/baseEntity';
import { Chat } from './chat.entity';

@Entity()
export class ChatThread extends BaseEntity {
  @Column()
  subjectType: string;

  @Column()
  subjectId: string;

  @OneToMany(() => Chat, (chat) => chat.thread, {
    cascade: ['insert'],
  })
  chats: Chat[];
}
