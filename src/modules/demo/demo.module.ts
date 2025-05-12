// src/modules/demo/demo.module.ts

import { Logger, Module } from '@nestjs/common';
import { DemoController } from './controllers/demo.controller';
import { DemoService } from './services/demo.service';
import { DemoRepository } from './repositories/demo.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DemoEntity } from './entities/demo.entity';
import { CacheService } from 'src/shared/services/cache/cache.service';
import { TypeOrmFilterHelper } from 'src/shared/utils/typeorm-filter.helper';


@Module({
  imports: [TypeOrmModule.forFeature([DemoEntity])],
  controllers: [DemoController],
  providers: [
    {
      provide: 'IDemoService',
      useClass: DemoService,
    },
    {
      provide: 'IDemoRepository',
      useClass: DemoRepository,
    },
    Logger,
    CacheService,
    TypeOrmFilterHelper,
  ],
  exports: [
    {
      provide: 'IDemoService',
      useClass: DemoService,
    },
    TypeOrmFilterHelper,
  ],
})
export class DemoModule {}
