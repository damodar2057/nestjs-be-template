// src/common/base/interfaces/base-repository.interface.ts



import { DeepPartial, EntityManager, FindManyOptions, FindOneOptions, FindOptionsWhere, InsertResult, ObjectId, ObjectLiteral, QueryRunner, SelectQueryBuilder } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { UpsertOptions } from "typeorm/repository/UpsertOptions";
import { BaseEntity } from "../../abstract/base.entity";
import { IPaginationOptions } from "./pagination-options.interface";
import { IPaginatedResult } from "../generics/pagination-included-response.interface";

// 2. Enhanced base repository interface with more specific types


export interface IBaseRepository<T extends BaseEntity> {
  findAndCount(options?: FindManyOptions<T>): Promise<{ data: T[]; total: number; }>;

  upsert(
    entityOrEntities: QueryDeepPartialEntity<T> | QueryDeepPartialEntity<T>[],
    conflictPathsOrOptions: string[] | UpsertOptions<T>
  ): Promise<InsertResult>;

  findOne(options: FindOneOptions<T>): Promise<T | null>;

  find(options?: FindManyOptions<T>): Promise<T[]>;

  create(data: DeepPartial<T>): Promise<T>;

  findById(id: string): Promise<T | null>;

  update(criteria: FindOptionsWhere<T>, partialEntity: QueryDeepPartialEntity<T>,queryRunner?: QueryRunner): Promise<T>;

  softDelete(id: string): Promise<void>;
  delete(id: string): Promise<void>;


  restore(id: string): Promise<void>;

  findPaginated(options: IPaginationOptions, where?: FindOptionsWhere<T>): Promise<IPaginatedResult<T>>;

  executeInTransaction<R>(operation: (entityManager: EntityManager) => Promise<R>): Promise<R>;

  createBaseQuery(): SelectQueryBuilder<T>;

  findWithRelationsAndFilters(
    filters: Record<string, any>,
    relations?: string[],
    pagination?: IPaginationOptions
  ): Promise<IPaginatedResult<T>>;
}

