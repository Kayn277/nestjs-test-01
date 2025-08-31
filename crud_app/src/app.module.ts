import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { JwtModule } from './jwt/jwt.module';
import { DatasourceModule } from './datasource/datasource.module';
import { AuthGuard } from './auth/guards/auth.guard';

@Module({
  imports: [DatasourceModule, JwtModule, UserModule],
  controllers: [],
  providers: [
    {
      provide: 'APP_GUARD',
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
