import { IsIn, IsOptional } from 'class-validator';

export class ArticlesFindDto {
  @IsOptional()
  title?: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  authorId?: string;

  @IsOptional()
  publishedAt?: Date;

  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  publishedOrder?: 'ASC' | 'DESC';
}
