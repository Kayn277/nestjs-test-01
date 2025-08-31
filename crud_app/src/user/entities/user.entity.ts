import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Article } from '../../article/entities/article.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Index({ unique: true })
  userId: string;

  @Column({ type: 'varchar', length: 64 })
  @Index({ unique: true })
  username: string;

  @Column('text')
  password: string;

  @OneToMany(() => Article, (article) => article.user, { onDelete: 'CASCADE' })
  articles: Article[];
}
