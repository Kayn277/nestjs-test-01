import { Module } from '@nestjs/common';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { JwtModule } from '../jwt/jwt.module';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Keyv } from 'keyv';
import { createKeyv } from '@keyv/redis';

@Module({
  imports: [
    JwtModule,
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configSerivce: ConfigService) => ({
        stores: [createKeyv(configSerivce.get('REDIS_URL'))],
        ttl: 60 * 1000, //For tests
      }),
    }),
    TypeOrmModule.forFeature([Article]),
  ],
  controllers: [ArticleController],
  providers: [ArticleService],
  exports: [TypeOrmModule],
})
export class ArticleModule {}
