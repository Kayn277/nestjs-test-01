import { Test, TestingModule } from '@nestjs/testing';
import { ArticleService } from './article.service';
import { Article } from './entities/article.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ObjectLiteral, Repository } from 'typeorm';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '../jwt/jwt.service';

const mockArticleRepository = () => ({
  findOne: jest.fn(),
  createQueryBuilder: jest.fn(() => ({
    where: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
  })),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

type MockRepo<T extends ObjectLiteral = any> = Partial<
  Record<keyof Repository<T>, jest.Mock>
> & {
  createQueryBuilder?: jest.Mock;
};
describe('ArticleService', () => {
  let service: ArticleService;
  let repo: MockRepo<Article>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArticleService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('token'),
            verify: jest.fn().mockReturnValue({ userId: '123' }),
          },
        },
        {
          provide: getRepositoryToken(Article),
          useFactory: mockArticleRepository,
        },
      ],
    }).compile();

    service = module.get<ArticleService>(ArticleService);
    repo = module.get<MockRepo<Article>>(getRepositoryToken(Article));
  });

  describe('findOne', () => {
    it('should return an article', async () => {
      const article = { articleId: '1', title: 'Test' } as Article;
      repo.findOne?.mockResolvedValue(article);

      const result = await service.findOne('1');
      expect(result).toEqual(article);
      expect(repo.findOne).toHaveBeenCalledWith({ where: { articleId: '1' } });
    });
  });

  describe('create', () => {
    it('should save a new article', async () => {
      const dto = { title: 'New Article', description: 'Desc' };
      const authorId = 'user1';

      const saved = { ...dto, articleId: '123', user: { userId: authorId } };
      repo.save?.mockResolvedValue(saved);

      const result = await service.create(dto, authorId);

      expect(repo.save).toHaveBeenCalledWith(
        expect.objectContaining({
          title: dto.title,
          description: dto.description,
          user: { userId: authorId },
        }),
      );
      expect(result).toEqual(saved);
    });
  });

  describe('update', () => {
    it('should update article if author matches', async () => {
      const article = {
        articleId: '1',
        user: { userId: 'user1' },
      } as Article;
      repo.findOne?.mockResolvedValue(article);
      repo.update?.mockResolvedValue({ affected: 1 });

      const dto = { articleId: '1', title: 'Updated' };
      const result = await service.update(dto, 'user1');

      expect(repo.update).toHaveBeenCalledWith(
        { articleId: '1', user: { userId: 'user1' } },
        expect.objectContaining({ title: 'Updated' }),
      );
      expect(result).toEqual({ affected: 1 });
    });

    it('should throw NotFoundException if not found', async () => {
      repo.findOne?.mockResolvedValue(null);

      await expect(
        service.update({ articleId: '99' }, 'user1'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw UnauthorizedException if author mismatch', async () => {
      repo.findOne?.mockResolvedValue({
        articleId: '1',
        user: { userId: 'user2' },
      });

      await expect(
        service.update({ articleId: '1', title: 'Updated' }, 'user1'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('delete', () => {
    it('should delete article if author matches', async () => {
      const article = { articleId: '1', user: { userId: 'user1' } } as Article;
      repo.findOne?.mockResolvedValue(article);
      repo.delete?.mockResolvedValue({ affected: 1 });

      const result = await service.delete('1', 'user1');
      expect(repo.delete).toHaveBeenCalledWith({
        articleId: '1',
        user: { userId: 'user1' },
      });
      expect(result).toEqual({ affected: 1 });
    });

    it('should throw NotFoundException if not found', async () => {
      repo.findOne?.mockResolvedValue(null);

      await expect(service.delete('99', 'user1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw UnauthorizedException if author mismatch', async () => {
      repo.findOne?.mockResolvedValue({
        articleId: '1',
        user: { userId: 'user2' },
      });

      await expect(service.delete('1', 'user1')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
