// src/utils/db-error-handler.util.ts

import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { DatabaseException } from 'src/common/exceptions/database.exception';
import { QueryFailedError, EntityNotFoundError } from 'typeorm';
import { ErrorMessageUtil } from './error-message.util';
import { POSTGRES_ERROR_CODES } from 'src/common/constants/db-error-codes.enum';
import { IDatabaseError } from 'src/common/base/interfaces/db-error.interface';
import { IDatabaseErrorHandler } from 'src/common/base/interfaces/db-error-handler.interface';

@Injectable()
export class DatabaseErrorHandler implements IDatabaseErrorHandler {
  private readonly logger = new Logger(DatabaseErrorHandler.name);

  constructor(private errorMessagesUtil: ErrorMessageUtil) {}

  handleError(error: any): never {
    this.logger.error('Database error occurred', error.stack);

    if (error instanceof QueryFailedError) {
      this.logger.log('Query failed error instance');
      return this.handleQueryFailedError(error);
    }

    if (error instanceof EntityNotFoundError) {
      return this.handleEntityNotFoundError(error);
    }

    const dbError = this.extractDatabaseError(error);

    if (!dbError) {
      throw error;
    }

    return this.handleDatabaseError(dbError);
  }

  private handleQueryFailedError(error: QueryFailedError): never {
    const dbError = this.extractDatabaseError(error);
    if (!dbError) {
      throw new DatabaseException(
        'An unexpected database error occurred.',
        HttpStatus.INTERNAL_SERVER_ERROR,
        'INTERNAL_ERROR',
        error.message,
      );
    }
    return this.handleDatabaseError(dbError);
  }

  private handleEntityNotFoundError(error: EntityNotFoundError): never {
    const message = this.errorMessagesUtil.getEntityNotFoundMessage(error);
    throw new DatabaseException(
      message,
      HttpStatus.NOT_FOUND,
      'RECORD_NOT_FOUND',
      error.message,
    );
  }

  private handleDatabaseError(dbError: IDatabaseError): never {
    const { code, detail, column, table, driverError } = dbError;
    const message = this.errorMessagesUtil.getDetailedErrorMessage(
      code,
      detail,
      table,
      column,
      driverError,
    );

    switch (code) {
      case POSTGRES_ERROR_CODES.UniqueViolation:
        throw new DatabaseException(
          message,
          HttpStatus.CONFLICT,
          'DUPLICATE_ENTRY',
          detail,
        );
      case POSTGRES_ERROR_CODES.ForeignKeyViolation:
        throw new DatabaseException(
          message,
          HttpStatus.BAD_REQUEST,
          'FOREIGN_KEY_VIOLATION',
          detail,
        );
      case POSTGRES_ERROR_CODES.NotNullViolation:
        throw new DatabaseException(
          message,
          HttpStatus.BAD_REQUEST,
          'NOT_NULL',
          detail,
        );
      case POSTGRES_ERROR_CODES.CheckViolation:
        throw new DatabaseException(
          message,
          HttpStatus.BAD_REQUEST,
          'RESOURCE_CONFLICT',
          detail,
        );
      case POSTGRES_ERROR_CODES.INVALID_TEXT_REPRESENTATION:
        throw new DatabaseException(
          message,
          HttpStatus.BAD_REQUEST,
          'INVALID_TEXT_REPRESENTATION',
          detail,
        );
      default:
        throw new DatabaseException(
          'An unexpected database error occurred.',
          HttpStatus.INTERNAL_SERVER_ERROR,
          'DATABASE_ERROR',
          detail,
        );
    }
  }

  private extractDatabaseError(error: any): IDatabaseError | null {
    if (error.code || error.driverError) {
      const pgError = error.driverError || error;
      return {
        code: pgError.code,
        detail: pgError.detail,
        table: pgError.table,
        column: pgError.column,
        driverError: pgError,
      };
    }
    return null;
  }
}
