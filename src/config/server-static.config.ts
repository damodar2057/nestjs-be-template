// src/config/server-static.config.ts

import { ServeStaticModuleOptions } from "@nestjs/serve-static";
import { join } from "path";

const serveStaticOptions: ServeStaticModuleOptions[] = [
    {
        rootPath: join(__dirname, '..', '..', '..', '/uploads/'),
        serveRoot: '/uploads',
        serveStaticOptions: {
            setHeaders: (res, path, stat)=> {
                res.setHeader('Cross-Origin-Resource-Policy','cross-origin');
                res.setHeader('Access-Control-Allow-Origin', '*');
            }
        }
    }
]

export default serveStaticOptions;