// src/common/exceptions/base.exception.ts

import { HttpException } from "@nestjs/common";
import { ErrorCodes } from "../constants/error-codes.enum";
import { BaseException } from "./base.exception";


export class NotificationException extends BaseException {
    constructor(
        public readonly message: string,
        public readonly code:keyof  typeof  ErrorCodes = ErrorCodes.NOTIFICATION_ERROR,
        public readonly statusCode: number,
        public readonly details?: any

    ){
        super(message, code, statusCode, details)
    }
}