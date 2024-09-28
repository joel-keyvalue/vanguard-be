import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../common/classes/baseEntity';

@Entity()
export class Email extends BaseEntity {
  @Column()
  message: string;

  @Column({ default: 'initial' })
  type: 'initial' | 'followup';

  @Column({ default: 'send' })
  status: 'send' | 'read';

  @Column('uuid', { nullable: true })
  threadId: string;

  @Column({
    nullable: true,
    default: 'Introduction to Our AI-Powered Solutions',
  })
  subject: string;
}
