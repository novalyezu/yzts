import {
  Column, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn,
} from 'typeorm';
import { User } from './index';

@Entity({ name: 'tbl_user_notification' })
export class UserNotification {
  @PrimaryColumn({ length: 128 })
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  @Column({ length: 64, nullable: false })
  user_id: string;

  @Index()
  @Column({ length: 32 })
  engagement: string;

  @Column('text')
  image: string;

  @Column('text')
  title: string;

  @Column('text')
  short: string;

  @Column('text')
  message: string;

  @Index()
  @Column({ length: 128 })
  ref_id: string;

  @Column({ nullable: false, default: false })
  is_read: boolean;

  @Index()
  @Column({
    type: 'timestamp', nullable: false, default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @Index()
  @Column({ type: 'timestamp', nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
