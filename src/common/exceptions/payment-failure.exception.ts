// src/




import { BaseException } from "./base.exception";

import { ErrorCodes } from "../constants/error-codes.enum";

export class PaymentFailureException extends BaseException{
          constructor(message:string, code:keyof typeof ErrorCodes,statusCode:number=500,details?:string

          ){
            super(message,code,statusCode,details)
          }
}