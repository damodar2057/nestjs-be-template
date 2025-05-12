// src/config/postgres.config.ts

import { ConfigService } from '@nestjs/config';
import { DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';

export const typeormConfig = async (
  config: ConfigService,
): Promise<DataSourceOptions & SeederOptions> => {
  return {
    type: 'postgres',
    host: config.get('db.host'),
    port: config.get('db.port'),
    username: config.get('db.username'),
    password: config.get('db.password'),
    database: config.get('db.database'),
    logging: false,
    logger: 'advanced-console',
    cache: false,
    dropSchema: false,
    synchronize: true,
    migrationsTableName: config.get('db.migrationsTableName'),
    migrationsTransactionMode: 'none',
    migrationsRun: config.get('db.migrationAutoRun'),
    migrations: [],
    entities: [],
    subscribers: [],
    seeds: [], // seeds file
    factories: [],
  };
};
