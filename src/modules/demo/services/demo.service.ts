// src/modules/demo/services/demo.service.ts

import { Inject, Injectable, Logger } from '@nestjs/common';
import { IDemoService } from '../interfaces/demo-service.interface';
import { IDemoRepository } from '../interfaces/demo-repository.interface';
import { BaseService } from 'src/common/abstract/base.service';
import { DemoEntity } from '../entities/demo.entity';

@Injectable()
export class DemoService
  extends BaseService<DemoEntity>
  implements IDemoService
{
  constructor(
    @Inject('IDemoRepository')
    protected readonly repository: IDemoRepository,
  ) {
    super(repository, new Logger(DemoService.name));
  }
}
