// src/common/base/repositories/base.repository.ts

import { DeepPartial, EntityManager, FindManyOptions, FindOneOptions, FindOptionsWhere, InsertResult, QueryRunner, Repository, SelectQueryBuilder } from "typeorm";
import { IBaseRepository } from "../base/interfaces/base-repository.interface";
import { BaseEntity } from "./base.entity";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { IPaginationOptions } from "../base/interfaces/pagination-options.interface";
import { IPaginatedResult } from "../base/generics/pagination-included-response.interface";
import { UpsertOptions } from "typeorm/repository/UpsertOptions";


export abstract class BaseRepository<T extends BaseEntity> implements IBaseRepository<T>{
    constructor(protected readonly repository: Repository<T>) {}

    async findAndCount(options?: FindManyOptions<T>): Promise<{ data: T[]; total: number; }> {
        const [data, total]= await this.repository.findAndCount(options)
        return {data, total}
    }
  
    async upsert(entityOrEntities: QueryDeepPartialEntity<T> | QueryDeepPartialEntity<T>[], conflictPathsOrOptions: string[] | UpsertOptions<T>): Promise<InsertResult>{
      return await this.repository.upsert(entityOrEntities, conflictPathsOrOptions)
    }
  
    async findOne(options: FindOneOptions<T>): Promise<T | null> {
      return this.repository.findOne(options);
    }
  
    async find(options?: FindManyOptions<T>): Promise<T[]> {
      return this.repository.find(options);
    }
  
    async create(data: DeepPartial<T>): Promise<T> {
      const entity = this.repository.create(data);
      return await this.repository.save(entity);
    }
  
    async findById(id: string): Promise<T | null> {
      return this.repository.findOne({ where: { id: +id } as FindOptionsWhere<T> });
    }
  
    async update(
      criteria: FindOptionsWhere<T>,
      partialEntity: QueryDeepPartialEntity<T>,
      queryRunner?: QueryRunner,
    ): Promise<T> {
      if (queryRunner) {
        await queryRunner.manager.getRepository(this.repository.target).update(criteria, partialEntity);
        return await queryRunner.manager.getRepository(this.repository.target).findOne({ where: criteria });
      }
    
      await this.repository.update(criteria, partialEntity);
      return await this.repository.findOne({ where: criteria });
    }
    
  
    async softDelete(id: string): Promise<void> {
      await this.repository.softDelete(id);
    }
    async delete(id: string): Promise<void> {
      await this.repository.delete(id);
    }
  
    async restore(id: string): Promise<void> {
      await this.repository.restore(id);
    }
  
    // Pagination Support
    async findPaginated(options: IPaginationOptions, where?: FindOptionsWhere<T>): Promise<IPaginatedResult<T>> {
      const [items, total] = await this.repository.findAndCount({
        where,
        take: options.pageSize,
        skip: (options.page - 1) * options.pageSize,
        order: options.sortBy ? ({ [options.sortBy]: options.sortOrder || 'ASC' } as any) : undefined, // Assert the type as any
      });
  
      return {
        data: items,
        pagination: {
          totalItems: total,
          currentPage: options.page,
          itemsPerPage: options.pageSize,
          totalPages: Math.ceil(total / options.pageSize),
        },
      };
    }
  
    /** For transaction management */
    async executeInTransaction<R>(operation: (entityManager: EntityManager) => Promise<R>): Promise<R> {
      const queryRunner = this.repository.manager.connection.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
  
      try {
        const result = await operation(queryRunner.manager);
        await queryRunner.commitTransaction();
        return result;
      } catch (error) {
        await queryRunner.rollbackTransaction();
      } finally {
        await queryRunner.release();
      }
    }
  
    /** Complex query builder */
     createBaseQuery(): SelectQueryBuilder<T> {
      return this.repository.createQueryBuilder(this.repository.metadata.tableName);
    }
  
    /** Complex query method */
    async findWithRelationsAndFilters(
      filters: Record<string, any>,
      relations: string[] = [],
      pagination?: IPaginationOptions,
    ): Promise<IPaginatedResult<T>> {
      const query = this.createBaseQuery();
      // add relations
      relations.forEach((relation) => {
        query.leftJoinAndSelect(`${this.repository.metadata.tableName}.${relation}`, relation);
      });
  
      // add filters dynamically
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          query.andWhere(`${this.repository.metadata.tableName}.${key} = :${key}`, {
            [key]: value,
          });
        }
      });
  
      // add pagination
      if (pagination) {
        query.skip((pagination.page - 1) * pagination.pageSize).take(pagination.pageSize);
  
        if (pagination.sortBy) {
          query.orderBy(`${this.repository.metadata.tableName}.${pagination.sortBy}`, pagination.sortOrder);
        }
      }
  
      const [items, total] = await query.getManyAndCount();
  
      return {
        data: items,
        pagination: {
          totalItems: total,
          currentPage: pagination.page,
          itemsPerPage: pagination.pageSize,
          totalPages: Math.ceil(total / pagination.pageSize),
        },
      };
    }
  }
  