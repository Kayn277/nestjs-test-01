import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { Repository } from 'typeorm';
import { ArticlesFindDto } from './dto/articles-find.dto';
import { ArticlesUpdateDto } from './dto/article.update.dto';
import { ArticleCreateDto } from './dto/article.create.dto';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article) private articleRepository: Repository<Article>,
  ) {}

  async findOne(articleId: string) {
    return this.articleRepository.findOne({ where: { articleId } });
  }

  async findAll(filter: ArticlesFindDto) {
    try {
      const queryBuilder = this.articleRepository.createQueryBuilder('article');

      if (filter.authorId) {
        queryBuilder.where('article.userId = :authorId', {
          authorId: filter.authorId,
        });
      }
      if (filter.title) {
        queryBuilder.where('article.title = :title', { title: filter.title });
      }
      if (filter.description) {
        queryBuilder.where('article.description = :description', {
          description: filter.description,
        });
      }
      if (filter.publishedAt) {
        queryBuilder.where('article.publishedAt = :publishedAt', {
          publishedAt: filter.publishedAt,
        });
      }
      if (filter.publishedOrder) {
        queryBuilder.orderBy('article.publishedAt', filter.publishedOrder);
      }

      return queryBuilder.getMany();
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }

  async create(article: ArticleCreateDto, authorId: string) {
    return this.articleRepository.save({
      ...article,
      publishedAt: new Date(),
      user: {
        userId: authorId,
      },
    });
  }

  async update(article: ArticlesUpdateDto, authorId: string) {
    const findedArticle = await this.findOne(article.articleId);

    if (!findedArticle) {
      throw new NotFoundException();
    }

    if (findedArticle.user.userId !== authorId) {
      throw new UnauthorizedException();
    }

    return this.articleRepository.update(
      {
        articleId: article.articleId,
        user: {
          userId: authorId,
        },
      },
      {
        ...article,
      },
    );
  }

  async delete(articleId: string, authorId: string) {
    const findedArticle = await this.findOne(articleId);

    if (!findedArticle) {
      throw new NotFoundException();
    }

    if (findedArticle.user.userId !== authorId) {
      throw new UnauthorizedException();
    }

    return this.articleRepository.delete({
      articleId: articleId,
      user: {
        userId: authorId,
      },
    });
  }
}
