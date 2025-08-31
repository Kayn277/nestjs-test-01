import {
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  UseGuards,
  Body,
  Param,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Request } from 'express';
import { ArticlesFindDto } from './dto/articles-find.dto';
import { ArticleService } from './article.service';
import { ArticleCreateDto } from './dto/article.create.dto';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ArticlesUpdateDto } from './dto/article.update.dto';

@ApiTags('article')
@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get('/:id')
  @ApiOperation({ summary: 'Get article by id' })
  @ApiResponse({ status: 200, description: 'Article found' })
  @ApiResponse({ status: 404, description: 'Article not found' })
  findOne(@Param('id') id: string) {
    return this.articleService.findOne(id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all articles' })
  @ApiResponse({ status: 200, description: 'Articles found' })
  @ApiQuery({
    name: 'title',
    required: false,
    description: 'Filter by title',
  })
  @ApiQuery({
    name: 'description',
    required: false,
    description: 'Filter by description',
  })
  @ApiQuery({
    name: 'authorId',
    required: false,
    description: 'Filter by authorId',
  })
  @ApiQuery({
    name: 'publishedAt',
    required: false,
    description: 'Filter by publishedAt',
    type: Date,
  })
  @ApiQuery({
    name: 'publishedOrder',
    required: false,
    description: 'Sort by publishedAt',
    enum: ['ASC', 'DESC'],
  })
  findAll(@Query() query: ArticlesFindDto) {
    return this.articleService.findAll(query);
  }

  @Put('/:id')
  @ApiOperation({ summary: 'Update article' })
  @ApiResponse({ status: 200, description: 'Article updated' })
  @ApiResponse({ status: 404, description: 'Article not found' })
  @UseGuards(AuthGuard)
  update(@Req() req: Request, @Body() article: ArticlesUpdateDto) {
    const userId = req.headers['userId'] as string;
    if (!userId) throw new UnauthorizedException();
    return this.articleService.update(article, userId);
  }

  @Post('/')
  @ApiOperation({ summary: 'Create new article' })
  @ApiResponse({ status: 201, description: 'Article created' })
  @UseGuards(AuthGuard)
  create(@Req() req: Request, @Body() article: ArticleCreateDto) {
    const userId = req.headers['userId'] as string;
    if (!userId) throw new UnauthorizedException();
    return this.articleService.create(article, userId);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Delete article' })
  @ApiResponse({ status: 200, description: 'Article deleted' })
  @ApiResponse({ status: 404, description: 'Article not found' })
  @UseGuards(AuthGuard)
  delete(@Req() req: Request, @Param('id') id: string) {
    const userId = req.headers['userId'] as string;
    if (!userId) throw new UnauthorizedException();
    return this.articleService.delete(id, userId);
  }
}
