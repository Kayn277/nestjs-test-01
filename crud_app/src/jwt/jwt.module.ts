import { Global, Module } from '@nestjs/common';
import { JwtService } from './jwt.service';
import { JwtModule as NestJsJwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Global()
@Module({
  providers: [JwtService],
  imports: [
    NestJsJwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secretOrPrivateKey: configService.get('JWT_SECRET'),
          signOptions: {
            expiresIn: '14d',
          },
        };
      },
    }),
  ],
  exports: [JwtService],
})
export class JwtModule {}
