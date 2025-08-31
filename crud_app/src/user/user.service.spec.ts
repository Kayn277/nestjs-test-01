import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, ObjectLiteral } from 'typeorm';

const mockUserRepository = () => ({
  findOneBy: jest.fn(),
  save: jest.fn(),
});

type MockRepository<T extends ObjectLiteral = any> = Partial<
  Record<keyof Repository<T>, jest.Mock>
>;

describe('UserService', () => {
  let service: UserService;
  let repo: MockRepository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useFactory: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repo = module.get<MockRepository<User>>(getRepositoryToken(User));
  });

  describe('getUser', () => {
    it('should return a user by userId', async () => {
      const user = { userId: '123', username: 'john' } as User;
      (repo.findOneBy as jest.Mock).mockResolvedValue(user);

      const result = await service.getUser('123');
      expect(result).toEqual(user);
      expect(repo.findOneBy).toHaveBeenCalledWith({ userId: '123' });
    });
  });

  describe('createUser', () => {
    it('should save and return a new user', async () => {
      const dto = { username: 'john', password: 'secret' };
      const savedUser = { userId: '1', ...dto } as User;
      (repo.save as jest.Mock).mockResolvedValue(savedUser);

      const result = await service.createUser(dto);
      expect(result).toEqual(savedUser);
      expect(repo.save).toHaveBeenCalledWith(dto);
    });
  });

  describe('getUserByName', () => {
    it('should return a user by username', async () => {
      const user = { userId: '1', username: 'alice' } as User;
      (repo.findOneBy as jest.Mock).mockResolvedValue(user);

      const result = await service.getUserByName('alice');
      expect(result).toEqual(user);
      expect(repo.findOneBy).toHaveBeenCalledWith({ username: 'alice' });
    });
  });
});
