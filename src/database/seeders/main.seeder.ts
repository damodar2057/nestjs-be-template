// src/database/seeders/main.seeder.ts

import { DataSource } from "typeorm";
import { Logger } from "@nestjs/common";
import { seedDemos } from "./demo.seeder";

const logger = new Logger('DatabaseSeeder');

// Define an array of seeder functions
const seeders = [
    { name: 'Demos', func: seedDemos },
    // add more seeders here
];

export async function runSeeders(dataSource: DataSource) {
    logger.log('Starting database seeding...');

    for (const seeder of seeders) {
        try {
            logger.log(`Running ${seeder.name} seeder...`);
            await seeder.func(dataSource);
            logger.log(`${seeder.name} seeder completed successfully.`);
        } catch (error) {
            logger.error(`${seeder.name} seeder failed:`, error);
        
            // Optionally, you can add a decision point here:
            // if you want to stop the entire process on any seeder failure, you can add:
            // throw error;
        }
    }

    logger.log("All seeding completed!");
}