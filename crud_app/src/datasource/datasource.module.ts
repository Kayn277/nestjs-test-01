import { Module } from '@nestjs/common';
import { DatasourceService } from './datasource.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [DatasourceService],
  exports: [DatasourceService],
})
export class DatasourceModule {}
