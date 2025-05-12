// src/common/interceptors/logging.interceptor.ts


import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as chalk from 'chalk'; 

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private requestLogger = new Logger('Request'); 
  private responseLogger = new Logger('Response'); 
  private readonly chalk = new chalk.Instance({ level: 3 });

  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse(); 
    const now = Date.now();
    const { method, url, ip } = request;
    const userAgent = request.headers['user-agent'] || 'Unknown Agent';

    // Capture current time for logging
    const formattedDate = new Date().toLocaleString();

    this.requestLogger.log(
      `${this.chalk.green(method)} ${this.chalk.yellow(url)} - ${this.chalk.blue('Agent:')} ${this.chalk.green(userAgent)} `
      ,
    );

    return next.handle().pipe(
      tap(() => {
        const statusCode = response.statusCode; 
        const contentLength = response.get('content-length') || '0'; 
        const timeTaken = Date.now() - now;
        response?.setHeader('Cross-Origin-Resource-Policy','cross-origin')

        this.responseLogger.log(
          `${this.chalk.green(method)} ${this.chalk.yellow(url)} - ${this.chalk.blue('Status:')} ${this.chalk.green(statusCode)} - ${this.chalk.blue('Content-Length:')} ${this.chalk.green(contentLength)} - ${this.chalk.blue('Time Taken:')} ${this.chalk.green(timeTaken + 'ms')}`
        );
      })
    );
  }
}
