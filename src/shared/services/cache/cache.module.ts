// src/modules/cache/cache.module.ts


import { CacheModule } from '@nestjs/cache-manager'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import * as redisStore from 'cache-manager-redis-store'
import { CacheService } from './cache.service'


@Module({
    imports: [
        CacheModule.registerAsync({
            isGlobal: true,
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                store: redisStore,
                host: configService.get('REDIS_HOST'),
                port: configService.get('REDIS_PORT'),
                password: configService.get('REDIS_PASSWORD'),
                ttl: configService.get('CACHE_TTL'),
                max: 1000, // maximum number of items in cache
                tls: configService.get('REDIS_TLS_ENABLED') ? {
                    rejectUnauthorized: false
                } : undefined
            })
        })],
    providers: [CacheService],
    exports: [CacheService]
})
export class RedisCacheModule { }