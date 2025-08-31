import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class ArticlesUpdateDto {
  @ApiPropertyOptional({
    description: 'The title of the article',
    example: 'Article Title',
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  title?: string;

  @ApiPropertyOptional({
    description: 'The content of the article',
    example: 'This is an article content',
  })
  @IsString()
  @IsOptional()
  content?: string;
}
