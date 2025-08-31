import { Injectable } from '@nestjs/common';
import { UserCreateDto } from '../user/dto/user.create';
import { UserService } from '../user/user.service';
import { hash } from 'bcrypt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}
  async register(user: UserCreateDto) {
    user.password = await hash(user.password, 10);
    return this.userService.createUser(user);
  }

  async login(loginData: LoginDto) {
    
  }
}
