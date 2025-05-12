// src/common/exceptions/base.exception.ts

import { HttpException } from "@nestjs/common";
import { ErrorCodes } from "../constants/error-codes.enum";


export class BaseException extends HttpException {
    constructor(
        public readonly message: string,
        public readonly code:keyof  typeof  ErrorCodes,
        public readonly statusCode: number = 500,
        public readonly details?: any

    ){
        super(message, statusCode)
    }
}