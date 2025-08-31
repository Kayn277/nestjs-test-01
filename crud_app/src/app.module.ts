import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { JwtModule } from './jwt/jwt.module';
import { DatasourceModule } from './datasource/datasource.module';
import { AuthGuard } from './auth/guards/auth.guard';
import { ArticleModule } from './article/article.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [DatasourceModule, JwtModule, UserModule, ArticleModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
