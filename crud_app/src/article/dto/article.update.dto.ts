import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class ArticlesUpdateDto {
  @IsNotEmpty()
  articleId: string;

  @IsString()
  @IsOptional()
  @Length(255)
  title?: string;

  @IsString()
  @IsOptional()
  content?: string;
}
