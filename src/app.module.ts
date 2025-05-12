// src/app.module.ts

import { Logger, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_INTERCEPTOR, APP_FILTER, APP_GUARD } from "@nestjs/core";
import { ServeStaticModule } from "@nestjs/serve-static";
import { TypeOrmModule } from "@nestjs/typeorm";
import Config from "./config";
import { typeormConfig } from "./config/postgres.config";
import serveStaticOptions from "./config/server-static.config";
import { AuthApiClient } from "./integrations/clients/auth.client";
import { DatabaseExceptionFilter } from "./shared/filters/db-exception.filter";
import { GlobalExceptionFilter } from "./shared/filters/global-exception.filter";
import { AuditTrailInterceptor } from "./shared/interceptors/audit-trail.interceptor";
import { LoggingInterceptor } from "./shared/interceptors/logging.interceptor";
import { ResponseInterceptor } from "./shared/interceptors/response.interceptor";
import { RedisCacheModule } from "./shared/services/cache/cache.module";
import { DatabaseErrorHandler } from "./shared/utils/db-error-handler.util";
import { ErrorMessageUtil } from "./shared/utils/error-message.util";
import { JwtUtil } from "./shared/utils/jwt.util";
import { JwtModule } from "@nestjs/jwt";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { ScheduleModule } from "@nestjs/schedule";
import { envValidate } from "./common/validation/env.validation";


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: Config,
      validate: envValidate,
      cache: true,
    }),
    JwtModule.register({
      global: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        ...(await typeormConfig(configService)),
        autoLoadEntities: true, // this will auto load all entities defined in TypeOrmModule.forFeature([]) in respective module without specifying file path in datasource options
      }),
    }),
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
    ServeStaticModule.forRoot(...serveStaticOptions),
    RedisCacheModule,

    // Business Module

  
  ],
  controllers: [],
  providers: [
    Logger,
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: DatabaseExceptionFilter, 
    },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditTrailInterceptor
    },
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: HttpCacheInterceptor,
    // },
    {
      provide: 'IDatabaseErrorHandler',
      useClass: DatabaseErrorHandler,
    },
    // {
    //   provide: APP_GUARD,
    //   useClass: AuthGuard,
    // },
    ErrorMessageUtil,
    AuthApiClient,
    JwtUtil,
  ],
})
export class AppModule {}
