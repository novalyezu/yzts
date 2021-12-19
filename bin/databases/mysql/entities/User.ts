import {
  Column, Entity, Index, PrimaryColumn, OneToMany,
} from 'typeorm';
import {
  Article,
} from './index';

@Entity({ name: 'tbl_user' })
export class User {
  @PrimaryColumn({ length: 64 })
  id: string;

  @Column({ length: 255, nullable: false })
  fullname: string;

  @Column({ length: 255, nullable: false, unique: true })
  email: string;

  @Column({ type: 'text', nullable: false })
  password: string;

  @Column({ length: 20, nullable: false })
  role: string;

  @Index()
  @Column({
    type: 'timestamp', nullable: false, default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @Index()
  @Column({ type: 'timestamp', nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @OneToMany(() => Article, (article) => article.author)
  article: Article[];
}
