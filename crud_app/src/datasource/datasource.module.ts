import { Module } from '@nestjs/common';
import { DatasourceService } from './datasource.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from '../utils/database.config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        return {
          ...databaseConfig,
        };
      },
    }),
    ConfigModule,
  ],
  providers: [DatasourceService],
  exports: [DatasourceService],
})
export class DatasourceModule {}
