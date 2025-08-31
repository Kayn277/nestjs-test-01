import { User } from '../entities/user.entity';

export class UserCreateDto implements Omit<User, 'userId' | 'articles'> {
  username: string;
  password: string;
}
