import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';
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
      | 'description'
    >
{
  @ApiProperty({
    description: 'The title of the article',
    example: 'Article Title',
    maxLength: 255,
  })
  @IsString()
  @MaxLength(255)
  title: string;

  @ApiPropertyOptional({
    description: 'The content of the article',
    example: 'This is an article content',
  })
  @IsString()
  content?: string;
}
