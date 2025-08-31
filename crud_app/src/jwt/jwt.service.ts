import { Injectable } from '@nestjs/common';
import { JwtService as NestJsJwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt.payload';
@Injectable()
export class JwtService {
  constructor(private readonly jwtService: NestJsJwtService) {}

  sign(payload: JwtPayload) {
    return this.jwtService.signAsync(payload);
  }

  verify(token: string): Promise<JwtPayload> {
    return this.jwtService.verifyAsync(token);
  }
}
