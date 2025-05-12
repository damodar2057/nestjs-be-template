// src/common/interceptors/cache.interceptor.ts

import { CacheInterceptor } from "@nestjs/cache-manager";
import { ExecutionContext, Injectable } from "@nestjs/common";

/**
 * This interceptor will auto cache 
 * http requests if caching mechanism is set globally.
 * Here, we just need to provide cache key..
 */
@Injectable()
export class HttpCacheInterceptor extends CacheInterceptor {
    protected trackBy(context: ExecutionContext): string | undefined {
        const request = context.switchToHttp().getRequest();
        const { httpAdapter } = this.httpAdapterHost;

        // Don't cache non GET request
        if (request.method !== 'GET') {
            return undefined;
        }

        // don't cache if user is authenticated
        if (request.user) {
            return undefined
        }

        // Generate cache key based on URL and query parameters
        const baseKey = httpAdapter.getRequestUrl(request);
        const queryParams = request.query ? JSON.stringify(request.query) : '';

        return `${baseKey}-${queryParams}`
    }
}