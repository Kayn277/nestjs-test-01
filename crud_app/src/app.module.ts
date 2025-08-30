import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { JwtModule } from './jwt/jwt.module';

@Module({
  imports: [JwtModule, UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
