//

import { registerAs } from "@nestjs/config"


export const RetryConfig = registerAs('retry', ()=> {
    return {
        defaultRetries: 3,
        factor: 2,
        minTimeout: 1000,
        maxTimeout: 30000,
        randomize: true,

    }
})