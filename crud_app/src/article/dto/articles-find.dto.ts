import { IsIn, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ArticlesFindDto {
  @ApiProperty({
    description: 'Filter by title',
    example: 'Article',
    required: false,
  })
  @IsOptional()
  readonly title?: string;

  @ApiProperty({
    description: 'Filter by description',
    example: 'Is an article description.',
    required: false,
  })
  @IsOptional()
  readonly description?: string;

  @ApiProperty({
    description: 'Filter by author id',
    example: '1234567890',
    required: false,
  })
  @IsOptional()
  readonly authorId?: string;

  @ApiProperty({
    description: 'Filter by published date',
    example: '2022-01-01',
    required: false,
  })
  @IsOptional()
  readonly publishedAt?: Date;

  @ApiProperty({
    description: 'Sort by published date',
    example: 'ASC',
    required: false,
    enum: ['ASC', 'DESC'],
  })
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  readonly publishedOrder?: 'ASC' | 'DESC';
}
