// src/config/app.config.ts

import { registerAs } from "@nestjs/config";


export const AppConfig = registerAs('app', ()=> {
    return {
        app_env: process.env.NODE_ENV || 'development',
        port: Number(process.env.PORT),
        baseUrl: process.env.BASE_URL,
        globalPrefix: process.env.PREFIX,
        webUrl: process.env.WEB_URL, // Load frontend Url from .env,
        jwtSecret: process.env.JWT_SECRET_KEY,
        jwksUri: process.env.JWKS_URI || 'http://localhost:9000/application/o/fmcsa-app/jwks/',
        encryptionSecretKey: process.env.ENCRYPTION_SECRET_KEY,
        jwksConnTimeout: process.env.JWKS_CONN_TIMEOUT || 30000,
        allowedOrigins: process.env.ALLOWED_ORIGINS,
        appId: process.env.APP_ID || 'demo-service',
        pkMicroserviceAccToken: process.env.MICROSERVICE_ACCESS_TOKEN
    }
})