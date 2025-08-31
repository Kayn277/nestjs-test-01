import {
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Request } from 'express';
import { ArticlesFindDto } from './dto/articles-find.dto';
import { ArticleService } from './article.service';

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get('/:id')
  findOne() {}

  @Get()
  findAll(@Query() query: ArticlesFindDto) {
    return this.articleService.findAll(query);
  }

  @Put('/:id')
  @UseGuards(AuthGuard)
  update(@Req() req: Request) {
    if (!req.headers['userId']) {
      throw new UnauthorizedException();
    }
  }

  @Post('/')
  @UseGuards(AuthGuard)
  create(@Req() req: Request) {
    if (!req.headers['userId']) {
      throw new UnauthorizedException();
    }
  }

  @Delete('/:id')
  @UseGuards(AuthGuard)
  delete(@Req() req: Request) {
    if (!req.headers['userId']) {
      throw new UnauthorizedException();
    }
  }
}
