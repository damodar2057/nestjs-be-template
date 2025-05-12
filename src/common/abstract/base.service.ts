// src/common/base/services/base.service.ts

import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  Inject,
} from '@nestjs/common';
import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  InsertResult,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { IBaseService } from '../base/interfaces/base-service.interface';

import { UpsertOptions } from 'typeorm/repository/UpsertOptions';
import { IBaseRepository } from '../base/interfaces/base-repository.interface';
import { BaseEntity } from './base.entity';

@Injectable()
export abstract class BaseService<T extends BaseEntity>
  implements IBaseService<T>
{
  constructor(
    @Inject('IBaseRepository')
    protected readonly repository: IBaseRepository<T>,
    protected logger: Logger,
  ) {}

  async hardDelete(id: string): Promise<void> {
    try {
      await this.repository.delete(id)
    } catch (error) {
      throw error
    }
  }
  async upsert(
    dto: QueryDeepPartialEntity<T> | QueryDeepPartialEntity<T>[],
    conflictPathsOrOptions: string[] | UpsertOptions<T>,
  ): Promise<T> {
    try {
      const insertResult = await this.repository.upsert(
        dto,
        conflictPathsOrOptions,
      );
      return await this.findOne({
        where: {
          id: insertResult?.generatedMaps[0]?.id,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async findAndCount(
    options?: FindManyOptions<T>,
  ): Promise<{
    data: T[];
    total: number;
  }> {
    try {
      return await this.repository.findAndCount(options);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create a new entity
   * @param user Current user for audit
   * @param dto Data to create entity
   */
  async create( dto: DeepPartial<T>): Promise<T> {
    try {
      // Add audit fields
      const entityToCreate = {
        ...dto,
        // createdBy: user.id,
        // updatedBy: user.id,
      } as DeepPartial<T>;

      const created = await this.repository.create(entityToCreate);
      this.logger.log(`Successfully created record with id: ${created.id}`);
      return created;
    } catch (error) {
      this.handleError('create', error);
    }
  }

  /**
   * Find all entities with pagination and filtering
   * @param options Query options for filtering and pagination
   */
  async findAll(options?: FindManyOptions<T>): Promise<T[]> {
    try {
      const entities = await this.repository.find(options);
      this.logger.debug(`Retrieved ${entities.length} entities`);
      return entities;
    } catch (error) {
      this.handleError('findAll', error);
    }
  }

  /**
   * Find one entity by criteria
   * @param options Query options
   */
  async findOne(options: FindOneOptions<T>): Promise<T> {
    try {
      const entity = await this.repository.findOne(options);

      if (!entity) {
        throw new NotFoundException(`Record not found`);
      }

      return entity;
    } catch (error) {
      this.handleError('findOne', error);
    }
  }

  /**
   * Find entity by ID
   * @param id Entity ID
   */
  async findById(id: string): Promise<T> {
    try {
      const entity = await this.repository.findById(id);

      if (!entity) {
        throw new NotFoundException(`Record with ID '${id}' not found`);
      }

      return entity;
    } catch (error) {
      this.handleError('findById', error);
    }
  }

  /**
   * Update entity
   * @param user Current user for audit
   * @param id Entity ID
   * @param dto Update data
   */
  async update(
    id: string,
    dto: QueryDeepPartialEntity<T>,
  ): Promise<T> {
    try {
      // Verify entity exists
      await this.findById(id);

      // Add audit fields
      const updateData = {
        ...dto,
      } as QueryDeepPartialEntity<T>;

      const updated = await this.repository.update(
        { id: +id } as unknown as FindOptionsWhere<T>,
        updateData,
      );

      this.logger.log(`Successfully updated record with id: ${id}`);
      return updated;
    } catch (error) {
      this.handleError('update', error);
    }
  }

  /**
   * Soft delete entity
   * @param user Current user for audit
   * @param id Entity ID
   */
  async remove(id: string): Promise<void> {
    try {
      // Verify entity exists
      await this.findById(id);

      await this.repository.softDelete(id);
      this.logger.log(`Successfully soft deleted record with id: ${id}`);
    } catch (error) {
      this.handleError('remove', error);
    }
  }

  /**
   * Restore soft deleted entity
   * @param user Current user for audit
   * @param id Entity ID
   */
  async restore(id: string): Promise<void> {
    try {
      await this.repository.restore(id);

      // Update audit fields after restore
      // await this.update(id, {
      //   deletedAt: null,
      //   updatedAt: new Date(),
      // } as QueryDeepPartialEntity<T>);

      this.logger.log(`Successfully restored record with id: ${id}`);
    } catch (error) {
      this.handleError('restore', error);
    }
  }

  /**
   * Handle various types of errors
   * @param operation Name of operation that failed
   * @param error Error object
   */
  protected handleError(operation: string, error: any): never {
    this.logger.error(`Error in ${operation} operation`, error.stack);

    if (error instanceof NotFoundException) {
      throw error;
    }

    if (error.code === '23505') {
      // PostgreSQL unique violation
      throw new BadRequestException('Record with these details already exists');
    }

    throw new InternalServerErrorException(
      `Error performing ${operation} operation. Please try again later.`,
    );
  }

  /**
   * Check if entity exists
   * @param id Entity ID
   */
  protected async exists(id: string): Promise<boolean> {
    const entity = await this.repository.findById(id);
    return !!entity;
  }
}
