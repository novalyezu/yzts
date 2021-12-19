import {
  Column, Entity, Index, PrimaryColumn, ManyToOne, JoinColumn,
} from 'typeorm';
import { User } from './index';

@Entity({ name: 'tbl_article' })
export class Article {
  @PrimaryColumn({ length: 16 })
  id: string;

  @Column({ type: 'text', unique: true })
  slug: string;

  @Column({ length: 64, nullable: true })
  author_id: string;

  @ManyToOne(() => User, (user) => user.article, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'author_id' })
  author: User;

  @Column('text')
  title: string;

  @Column('text')
  description: string;

  @Column('text')
  image: string;

  @Column('text')
  content: string;

  @Index()
  @Column({
    type: 'decimal', precision: 12, scale: 10, nullable: false, default: 1,
  })
  popularity: number;

  @Index()
  @Column({ type: 'timestamp', nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  last_calc_time: Date;

  @Index()
  @Column({
    type: 'timestamp', nullable: false, default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @Index()
  @Column({ type: 'timestamp', nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
