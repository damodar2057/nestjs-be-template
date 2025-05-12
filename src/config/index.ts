//  src/config/index.ts

import { AppConfig } from "./app.config";
import { DbConfig } from "./db.config";
import { HttpConfig } from "./http.config";
import { RetryConfig } from "./retry.config";
import { ServicesConfig } from "./services.config";

const Config = [AppConfig,DbConfig, ServicesConfig, RetryConfig, HttpConfig]
export default Config;