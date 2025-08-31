import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { JwtService } from '../../jwt/jwt.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest() as Request;

    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }

    const verify = await this.jwtService.verify(token);
    if (!verify) {
      throw new UnauthorizedException();
    }

    request.headers['userId'] = verify.userId;
    request.headers['username'] = verify.username;

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const token = request.cookies.session;
    if (!token) return undefined;
    return token;
  }
}
