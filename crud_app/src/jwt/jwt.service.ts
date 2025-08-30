import { Injectable } from '@nestjs/common';
import { JwtService as NestJsJwtService } from '@nestjs/jwt';
@Injectable()
export class JwtService {
  constructor(private readonly jwtService: NestJsJwtService) {}

  sign(payload: any) {
    return this.jwtService.signAsync(payload);
  }

  verify(token: string) {
    return this.jwtService.verifyAsync(token);
  }
}
