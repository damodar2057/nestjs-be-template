// // src/common/base/interfaces/base-service.interface.ts

import { DeepPartial, FindManyOptions, FindOneOptions } from "typeorm";
import { BaseEntity } from "../../abstract/base.entity";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { UpsertOptions } from "typeorm/repository/UpsertOptions";


export interface IBaseService<T extends BaseEntity> {
    create( dto: DeepPartial<T>): Promise<T>;
    upsert(entityOrEntities: QueryDeepPartialEntity<T> | QueryDeepPartialEntity<T>[], conflictPathOptions: string[] | UpsertOptions<T>): Promise<T>;
    findAll(options?: FindManyOptions<T>): Promise<T[]>;
    findOne(options: FindOneOptions<T>): Promise<T>;
    findById(id: string): Promise<T>;
    remove(id: string): Promise<void>;
    hardDelete(id: string): Promise<void>;
    update(id: string, dto: QueryDeepPartialEntity<T>): Promise<T>;
    restore(id: string): Promise<void>;
    findAndCount(options: FindManyOptions<T>): Promise<{data: T[], total: number}>

}