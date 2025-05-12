// src/common/interceptors/response.interceptor.ts

import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from "@nestjs/common";
import { Response } from "express";
import { Observable } from 'rxjs';
import {  map } from 'rxjs/operators';
import { format } from 'date-fns';

/**
 * This interceptor is for making response standard
 */

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
    private logger = new Logger(ResponseInterceptor.name)
    constructor() { }


    intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
        return next.handle().pipe(
            map((res: any) => this.responseHandler(res, context))
        )
    }
    responseHandler(res: any, context: ExecutionContext) {
        const ctx = context.switchToHttp()
        const request = ctx.getRequest()
        const message = res?.message || 'success'
        const baseResponse = {
            message: message,
            path: request.url,
            timestamp: format(new Date(), 'yyyy-MM-dd HH:mm:ss')
        }
        
        const statusCode = ctx.getResponse().statusCode
        return this.formatResponse(res, request, statusCode, baseResponse)
    }

    formatResponse(res: any, request: any, statusCode: any, baseResponse: any) {
        if (!res) {
            return {
                ...baseResponse,
                statusCode,
                data: null
            }
        }

        if (typeof res === 'object' && 'pagination' in res) {
            return {
                ...baseResponse,
                data: res['data'] || {},
                pagination: res['pagination'] || {}
            }
        } else {
            return {
                ...baseResponse,
                data: res
            }
        }
    }
}