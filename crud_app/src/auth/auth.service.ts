import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserCreateDto } from '../user/dto/user.create';
import { UserService } from '../user/user.service';
import { hash, compare } from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '../jwt/jwt.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  async register(user: UserCreateDto) {
    user.password = await hash(user.password, 10);
    return this.userService.createUser(user);
  }

  async login(loginData: LoginDto) {
    const user = await this.userService.getUserByName(loginData.username);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const isValid = await compare(loginData.password, user.password);
    if (!isValid) {
      throw new UnauthorizedException('Password not valid');
    }

    return this.jwtService.sign({
      userId: user.userId,
      username: user.username,
    });
  }
}
