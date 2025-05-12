// src/modules/cache/cache.service.ts

import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject, Injectable } from "@nestjs/common";
import { Cache } from "cache-manager";


@Injectable()
export class CacheService {
    constructor(
        @Inject(CACHE_MANAGER) private readonly cache: Cache
    ){}

    async get<T>(key: string): Promise<T | undefined> {
        return await this.cache.get<T>(key);
    }

    async set(key: string, value: any, ttl?: number): Promise<void> {
        await this.cache.set(key, value, ttl);
    }

    async del(key:string): Promise<void> {
        await this.cache.del(key);
    }

    async clear(): Promise<void> {
        await this.cache.clear()
    }

    // helper method to generate consistent key
    generateKey(prefix: string, ...args: string[]): string {
        return `${prefix}:${args.join(':')}`
    }


}