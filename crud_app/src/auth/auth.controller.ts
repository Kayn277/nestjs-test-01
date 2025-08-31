import { Body, Controller, Post, Res } from '@nestjs/common';
import { UserCreateDto } from '../user/dto/user.create';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('register')
  async register(@Body() user: UserCreateDto) {
    return this.authService.register(user);
  }

  @Post('login')
  async login(
    @Body() credentials: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    try {
      const token = await this.authService.login(credentials);
      response.cookie('session', token, { httpOnly: true });
      return response.status(200).send();
    } catch (err) {
      return response
        .status(401)
        .json({ message: 'Invalid credentials', error: err });
    }
  }
}
