// src/shared/dtos/error-response.dto.ts

export interface IErrorResponse {
    statusCode: number;
    code: string;
    message: string;
    details?: any;
    errors?: any;
    timestamp: string;
    path: string;
}