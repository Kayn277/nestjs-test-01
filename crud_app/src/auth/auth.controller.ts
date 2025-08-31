import { Body, Controller, Post, Res } from '@nestjs/common';
import { UserCreateDto } from '../user/dto/user.create';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('register')
  register(@Body() user: UserCreateDto) {
    return this.authService.register(user);
  }

  @Post('login')
  login(
    @Body() credentials: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    this.authService
      .login(credentials)
      .then((token) => response.cookie('session', token).status(200).send())
      .catch((err) => response.status(404).send(err));
  }
}
