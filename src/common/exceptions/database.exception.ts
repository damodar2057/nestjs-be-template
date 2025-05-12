//

import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCodes } from '../constants/error-codes.enum';

export class DatabaseException extends HttpException {
  constructor(message: string, statusCode: HttpStatus, public readonly code?: keyof typeof ErrorCodes, public readonly detail?: string) {
    super(
      {
        statusCode,
        message,
        error: 'Database Error',
        code,
        detail,
      },
      statusCode,
    );
  }
}

