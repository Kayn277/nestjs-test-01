import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { User } from '../entities/user.entity';

export class UserCreateDto implements Omit<User, 'userId' | 'articles'> {
  @IsString()
  @MaxLength(64)
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;
}
