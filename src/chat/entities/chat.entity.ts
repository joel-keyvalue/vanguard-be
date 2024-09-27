import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../common/classes/baseEntity';
import { ChatThread } from './chatThread.entity';

@Entity()
export class Chat extends BaseEntity {
  @Column()
  message: string;

  @Column()
  messageType: string;

  @Column({ type: 'jsonb' })
  metaData: Record<string, unknown>;

  @Column({ nullable: true })
  senderName: string;

  @Column({ nullable: true })
  senderType: string;

  @Column('uuid', { nullable: true })
  threadId: string;

  @ManyToOne(() => ChatThread)
  @JoinColumn({ referencedColumnName: 'id', name: 'thread_id' })
  thread: ChatThread;
}
