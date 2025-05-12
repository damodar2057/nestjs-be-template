//

import { ErrorCodes } from "../constants/error-codes.enum";
import { BaseException } from "./base.exception";


export class ForbiddenException extends BaseException{
    constructor(
        public readonly message: string,
        public readonly code = ErrorCodes.FORBIDDEN,
        public readonly statusCode: number = 403,
        public readonly details?: any
    ){
        super(message, code, statusCode, details)
    }
}