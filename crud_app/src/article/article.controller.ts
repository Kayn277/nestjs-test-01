import {
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Request } from 'express';

@Controller('article')
export class ArticleController {
  @Get('/:id')
  findOne() {}

  @Get()
  findAll() {}

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
