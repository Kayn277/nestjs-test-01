import { Test, TestingModule } from '@nestjs/testing';
import { ArticleService } from './article.service';
import { Article } from './entities/article.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, ObjectLiteral } from 'typeorm';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

const mockArticleRepository = () => ({
  findOne: jest.fn(),
  createQueryBuilder: jest.fn(() => ({
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    addOrderBy: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
  })),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

const mockCacheManager = () => ({
  get: jest.fn().mockResolvedValue(null),
  set: jest.fn().mockResolvedValue(undefined),
  clear: jest.fn().mockResolvedValue(undefined),
});

type MockRepo<T extends ObjectLiteral = any> = Partial<
  Record<keyof Repository<T>, jest.Mock>
> & { createQueryBuilder?: jest.Mock };

describe('ArticleService', () => {
  let service: ArticleService;
  let repo: MockRepo<Article>;
  let cacheManager: Cache;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArticleService,
        {
          provide: CACHE_MANAGER,
          useFactory: mockCacheManager,
        },
        {
          provide: getRepositoryToken(Article),
          useFactory: mockArticleRepository,
        },
      ],
    }).compile();

    service = module.get<ArticleService>(ArticleService);
    repo = module.get<MockRepo<Article>>(getRepositoryToken(Article));
    cacheManager = module.get<Cache>(CACHE_MANAGER);
  });

  describe('findOne', () => {
    it('should return article from cache', async () => {
      const article = { articleId: '1', title: 'Test' } as Article;
      (cacheManager.get as jest.Mock).mockResolvedValue(article);

      const result = await service.findOne('1');
      expect(result).toEqual(article);
      expect(cacheManager.get).toHaveBeenCalledWith('findOne-Article-1');
    });

    it('should return article from DB and set cache', async () => {
      (cacheManager.get as jest.Mock).mockResolvedValue(null);
      const article = { articleId: '1', user: { userId: 'user1' } } as Article;
      (repo.findOne as jest.Mock).mockResolvedValue(article);

      const result = await service.findOne('1');
      expect(result).toEqual(article);
      expect(repo.findOne).toHaveBeenCalledWith({
        where: { articleId: '1' },
        relations: ['user'],
      });
      expect(cacheManager.set).toHaveBeenCalledWith(
        'findOne-Article-1',
        article,
      );
    });
  });

  describe('findAll', () => {
    it('should return articles from cache', async () => {
      const articles = [{ articleId: '1' }] as Article[];
      (cacheManager.get as jest.Mock).mockResolvedValue(articles);

      const result = await service.findAll({ title: 'Nest' });
      expect(result).toEqual(articles);
      expect(cacheManager.get).toHaveBeenCalledWith(
        'findMany-Article-{"title":"Nest"}',
      );
    });

    it('should return articles from DB and set cache', async () => {
      (cacheManager.get as jest.Mock).mockResolvedValue(null);

      const qbMock = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        addOrderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([{ articleId: '1' }]),
      };
      (repo.createQueryBuilder as jest.Mock).mockReturnValue(qbMock);

      const result = await service.findAll({ title: 'Nest' });

      expect(result).toEqual([{ articleId: '1' }]);
      expect(qbMock.leftJoinAndSelect).toHaveBeenCalledWith(
        'article.user',
        'user',
      );
      expect(cacheManager.set).toHaveBeenCalledWith(
        'findMany-Article-{"title":"Nest"}',
        [{ articleId: '1' }],
      );
    });
  });

  describe('create', () => {
    it('should save article and clear cache', async () => {
      const dto = { title: 'New', description: 'Desc' };
      const saved = { ...dto, articleId: '1', user: { userId: 'user1' } };
      (repo.save as jest.Mock).mockResolvedValue(saved);

      const result = await service.create(dto, 'user1');

      expect(repo.save).toHaveBeenCalledWith(
        expect.objectContaining({
          title: dto.title,
          user: { userId: 'user1' },
        }),
      );
      expect(cacheManager.clear).toHaveBeenCalled();
      expect(result).toEqual(saved);
    });
  });

  describe('update', () => {
    it('should update article if author matches', async () => {
      const article = { articleId: '1', user: { userId: 'user1' } } as Article;
      (repo.findOne as jest.Mock).mockResolvedValue(article);
      (repo.update as jest.Mock).mockResolvedValue({ affected: 1 });

      const result = await service.update('1', { title: 'Updated' }, 'user1');

      expect(repo.update).toHaveBeenCalledWith(
        { articleId: '1', user: { userId: 'user1' } },
        { title: 'Updated' },
      );
      expect(cacheManager.clear).toHaveBeenCalled();
      expect(result).toEqual({ affected: 1 });
    });

    it('should throw NotFoundException if article not found', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue(null);

      await expect(
        service.update('1', { title: 'Updated' }, 'user1'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw UnauthorizedException if author mismatch', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue({
        articleId: '1',
        user: { userId: 'user2' },
      });

      await expect(
        service.update('1', { title: 'Updated' }, 'user1'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('delete', () => {
    it('should delete article if author matches', async () => {
      const article = { articleId: '1', user: { userId: 'user1' } } as Article;
      (repo.findOne as jest.Mock).mockResolvedValue(article);
      (repo.delete as jest.Mock).mockResolvedValue({ affected: 1 });

      const result = await service.delete('1', 'user1');

      expect(repo.delete).toHaveBeenCalledWith({
        articleId: '1',
        user: { userId: 'user1' },
      });
      expect(cacheManager.clear).toHaveBeenCalled();
      expect(result).toEqual({ affected: 1 });
    });

    it('should throw NotFoundException if article not found', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.delete('1', 'user1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw UnauthorizedException if author mismatch', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue({
        articleId: '1',
        user: { userId: 'user2' },
      });

      await expect(service.delete('1', 'user1')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
