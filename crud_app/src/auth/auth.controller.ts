import { Body, Controller, Post } from '@nestjs/common';
import { UserCreateDto } from '../user/dto/user.create';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('register')
  register(@Body() user: UserCreateDto) {
    return this.authService.register(user);
  }
}
