import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { JwtModule } from './jwt/jwt.module';
import { DatasourceModule } from './datasource/datasource.module';

@Module({
  imports: [DatasourceModule, JwtModule, UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
