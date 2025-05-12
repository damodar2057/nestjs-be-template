//

import { registerAs } from "@nestjs/config"


export const HttpConfig = registerAs('http', ()=> {
    return {
        defaultTimeout: 5000,
        defaultRetries: 3,
        useCircuitBreaker: true,
        failureThreshold: 5,
        resetTimeout: 30000,

    }
})