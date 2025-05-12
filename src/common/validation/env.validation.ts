// src/common/validation/env.validation.ts

import { plainToInstance } from "class-transformer";
import { IsEnum, IsNotEmpty, IsNumber, IsString, Max, Min, validateSync } from "class-validator";


enum Environment {
    Development = 'development',
    Production = 'production',
    Test = 'test',
}

class EnvironmentVariables {
    @IsNotEmpty()
    @IsEnum(Environment)
    NODE_ENV: Environment;

    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    @Max(65535)
    PORT: number;

    @IsNotEmpty()
    @IsString()
    APP_ID: string;

    @IsNotEmpty()
    @IsString()
    BASE_URL: string;



    @IsNotEmpty()
    @IsString()
    DATABASE_NAME: string;


    @IsNotEmpty()
    @IsString()
    DATABASE_PASSWORD: string;

    @IsNotEmpty()
    @IsString()
    DATABASE_USER: string;

    @IsNotEmpty()
    @IsString()
    DATABASE_HOST: string;

    // Integration service urls (microservices url)

    @IsNotEmpty()
    @IsString()
    AUTH_SERVICE_URL: string;



}


export function envValidate(config: Record<string, unknown>) {
    const validatedConfig = plainToInstance(
        EnvironmentVariables,
        config,
        { enableImplicitConversion: true }
    );
    const errors = validateSync(validatedConfig, { skipMissingProperties: false })
    if (errors.length > 0) {
        throw new Error(errors.toString())
    }

    return validatedConfig;
}