// src/utils/error-message.util.ts

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EntityNotFoundError } from 'typeorm';

@Injectable()
export class ErrorMessageUtil {
    private readonly errorMessages: Record<string, string>;

    constructor(private configService: ConfigService) {
        this.errorMessages = {
            '23505': 'A record with this value already exists', // unique violation
            '23503': 'Referenced record does not exist', // foreign key violation
            '23502': 'A required value was not provided', // not null violation
            '23514': 'The value violates a check constraint', // check violation
            '22P02': 'Invalid input format. Please check your data.', // check violation
        };
    }

    getErrorMessage(errorCode: string): string {
        return this.errorMessages[errorCode] || 'An unexpected database error occurred.';
    }

    getDetailedErrorMessage(errorCode: string, detail?: string, table?: string,column?: string,driverError?: any): string {
        const baseMessage = this.getErrorMessage(errorCode);
        if (this.configService.get('NODE_ENV') === 'development' && table && column) {
            return `${baseMessage}. Please check value of ${column}  in ${table}`;
        }
        if(driverError && !table && !column){
            return `${baseMessage}. Details: ${driverError.message || driverError}`;
            
        }
        if(detail){
            return `${baseMessage}. Details: ${detail}`;

        }
        return baseMessage;
    }

    getEntityNotFoundMessage(error: EntityNotFoundError): string {
        const entityName = error.message.match(/(?<=from ).*(?= could not be found)/)?.[0] || 'Entity';
        return `The requested ${entityName} could not be found.`;
    }

    getConstraintName(detail: string): string | null {
        const match = detail.match(/(?<=constraint ").*(?=")/);
        return match ? match[0] : null;
    }

    getColumnName(detail: string): string | null {
        const match = detail.match(/(?<=\().*(?=\))/);
        return match ? match[0] : null;
    }
}