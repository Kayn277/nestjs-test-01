import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article) private articleRepository: Repository<Article>,
  ) {}

  async findOne(articleId: string) {
    return this.articleRepository.findOne({ where: { articleId } });
  }

  async findAll() {
    return this.articleRepository.find();
  }

  async create(article: Article) {
    return this.articleRepository.save(article);
  }
}
