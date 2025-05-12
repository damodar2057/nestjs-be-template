//

import { BaseException } from "./base.exception";
import { ErrorCodes }  from '../constants/error-codes.enum'

export class AuthProxyException extends BaseException {
    constructor(message: string, code: keyof typeof ErrorCodes, statusCode: number, details?: any){
        super(message,code, statusCode, details)
    }
}