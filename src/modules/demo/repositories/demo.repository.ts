// src/modules/demo/repositories/demo.repository.ts

import { Injectable } from "@nestjs/common";
import { DemoEntity } from "../entities/demo.entity";
import { IDemoRepository } from "../interfaces/demo-repository.interface";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseRepository } from "src/common/abstract/base.repository";
import { CacheService } from "src/shared/services/cache/cache.service";


@Injectable()
export class DemoRepository extends BaseRepository<DemoEntity> implements IDemoRepository {
    constructor(
        @InjectRepository(DemoEntity)
        protected readonly repository: Repository<DemoEntity>,
        private readonly cache: CacheService
    ) {
        super(repository)
    }

}