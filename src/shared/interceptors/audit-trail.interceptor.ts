// 

import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { Request, Response } from "express";
import { Observable, tap } from "rxjs";
import { ParkingEvents } from "src/common/constants/event.enum";
import { GenerateAuditTrailEvent } from "src/common/events/audit-trail.event";

@Injectable()
export class AuditTrailInterceptor implements NestInterceptor {
    constructor(private readonly eventEmitter: EventEmitter2, private configService: ConfigService) {}

    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
        const httpContext = context.switchToHttp();
        const request: Request = httpContext.getRequest();
        const response: Response = httpContext.getResponse();
        const currentUser = request["user"];
        return next.handle().pipe(
            tap(() => {
                this.eventEmitter.emit(
                    ParkingEvents.GENERATE_AUDIT_TRAIL,
                    new GenerateAuditTrailEvent(
                        this.configService.get<string>('app.appId'),
                        `${request.method} ${request.path.replace('/api/v1/','').replace(/\//g, ".")}`, // Keep original path format
                        request.url,
                        this.sanitizeRequest(request), // Modified to avoid circular structure
                        this.sanitizeResponse(response), // Modified to avoid circular structure
                        currentUser?.email || "",
                        currentUser?.phone || "",
                        currentUser?.id || ""
                    )
                );
            })
        );
    }

    private sanitizeRequest(request: Request): Partial<Request> {
        return {
            method: request.method,
            url: request.url,
            query: request.query,
            body: this.sanitizeRequestBody(request.body),
            headers: this.sanitizeHeaders(request.headers),
            ip: request.ip,
        };
    }

    private sanitizeResponse(response: any): Partial<any> {
        return {
            statusCode: response.statusCode,
            code: response.code || null,
            message: response?.message || null,
            error: response?.error || null, 
            pagination: response?.pagination || null, 
            meta: response?.meta || null, 
            headers: response?.headers || null 
        };
    }

    private sanitizeRequestBody(body: any): any {
        if (!body) return {};
        const sanitized = { ...body };
        delete sanitized.password; // Exclude sensitive fields
        delete sanitized.token;
        return sanitized;
    }

    private sanitizeHeaders(headers: any): any {
        const sanitized = { ...headers };
        delete sanitized.authorization; // Remove sensitive header info
        return sanitized;
    }
}
