import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserCreateDto } from './dto/user.create';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}
  async getUser(userId: string): Promise<Omit<User, 'password'> | null> {
    return this.usersRepository.findOneBy({
      userId: userId,
    });
  }

  async createUser(user: UserCreateDto) {
    return this.usersRepository.save(user);
  }
}
