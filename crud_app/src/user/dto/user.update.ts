import { User } from '../entities/user.entity';

export class UserUpdateDto
  implements Partial<Pick<Omit<User, 'userId'>, 'password'>> {}
