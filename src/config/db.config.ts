// src/config/db.config.ts

import { registerAs } from '@nestjs/config'

export const DbConfig = registerAs('db', ()=> {
    return {
        host: process.env.DATABASE_HOST,
        port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
        database: process.env.DATABASE_NAME,
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        migrationTableName: process.env.MIGRATION_TABLE_NAME,
        migrationAutoRun: Boolean(process.env.MIGRATION_AUTO_RUN)
    }}
)