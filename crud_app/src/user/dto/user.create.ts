import { IsNotEmpty, IsString, Length } from 'class-validator';
import { User } from '../entities/user.entity';

export class UserCreateDto implements Omit<User, 'userId' | 'articles'> {
  @IsString()
  @Length(64)
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;
}
