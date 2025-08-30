import { Module } from '@nestjs/common';
import { DatasourceService } from './datasource.service';

@Module({
  providers: [DatasourceService],
})
export class DatasourceModule {}
