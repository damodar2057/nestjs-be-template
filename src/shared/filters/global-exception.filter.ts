//

import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { BaseException } from "../../common/exceptions/base.exception";
import { ErrorCodes } from "../../common/constants/error-codes.enum";
import { Request, Response } from "express";
import { ExceptionsHandler } from "@nestjs/core/exceptions/exceptions-handler";
import { DatabaseException } from "../../common/exceptions/database.exception";
import { QueryFailedError } from "typeorm";
import { IErrorResponse } from "../dtos/error-response.dto";


@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(GlobalExceptionFilter.name)
    constructor(
        private readonly configService: ConfigService,
    ) { }
    catch(exception: ExceptionsHandler, host: ArgumentsHost) {      
        const ctx = host.switchToHttp();
        const request = ctx.getRequest<Request>();
        const response = ctx.getResponse<Response>();
        // Build error response
        const errorResponse = this.buildErrorResponse(exception, request);

        // Log error
        // this.logError(errorResponse, exception);

        // Send response
        response.status(errorResponse.statusCode).json(errorResponse);
    }

    private buildErrorResponse(exception: unknown, request: Request): IErrorResponse {
        if (exception instanceof BaseException) {
            return {
                    statusCode: exception.statusCode,
                    code: ErrorCodes[exception.code],
                    message: exception?.message,
                    details: exception.details,
                    timestamp: new Date().toISOString(),
                    path: request.url,
            };
        }

        if (exception instanceof HttpException) {
            return {
                statusCode: exception.getStatus(),
                code:  ErrorCodes.HTTP_EXCEPTION,
                message: exception?.message,
                timestamp: new Date().toISOString(),
                path: request.url,
            };
        }

        if (exception instanceof DatabaseException) {
            return {
                statusCode: exception.getStatus(),
                code: exception.code,
                message: exception?.message,
                details: exception.detail,
                timestamp: new Date().toISOString(),
                path: request.url,
            };
        }

        // Handle unexpected errors
        const isProduction = this.configService.get('NODE_ENV') === 'production';
        return {
            statusCode: 500,
            code: ErrorCodes.INTERNAL_ERROR,
            message: isProduction ? 'Internal server error' : (exception as Error)?.message,
            timestamp: new Date().toISOString(),
            path: request.url,
        };
    }

    private logError(errorResponse: IErrorResponse, exception: unknown): void {
        const errorLog = {
            ...errorResponse,
            stack: exception instanceof Error ? exception.stack : undefined,
        };

        if (errorResponse.statusCode >= 500) {
            this.logger.error('Server error occurred', errorLog);
        } else {
            this.logger.warn('Client error occurred', errorLog);
        }
    }
}