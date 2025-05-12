//  
import { ConfigModule, ConfigService } from "@nestjs/config";
import { DataSource } from "typeorm";


ConfigModule.forRoot()
export const dataSource = new DataSource({
  type: "postgres",
  host: process.env.DATABASE_HOST,
  port: +process.env.DATABASE_PORT,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,

  entities: [

  ],
  subscribers: [],
  
  synchronize: false,
  logging: ["query", "error", "schema"],
  
});



dataSource.initialize()
  .then(() => console.log("Database connected successfully"))
  .catch(err => console.error("Database connection error", err));
dataSource.initialize()
  .then(() => console.log("Database connected successfully"))
  .catch(err => console.error("Database connection error", err));
