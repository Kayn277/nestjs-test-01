import { IsString, Length } from 'class-validator';
import { Article } from '../entities/article.entity';

export class ArticleCreateDto
  implements
    Omit<
      Article,
      | 'userId'
      | 'articleId'
      | 'createdAt'
      | 'publishedAt'
      | 'updatedAt'
      | 'user'
    >
{
  @IsString()
  @Length(255)
  title: string;

  @IsString()
  description: string;
}
