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

  @Column({ unique: true, type: 'varchar', length: 64 })
  username: string;

  @Column('text')
  password: string;

  @OneToMany(() => Article, (article) => article.user)
  articles: Article[];
}
