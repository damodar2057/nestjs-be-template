//

import { registerAs } from "@nestjs/config"


export const ServicesConfig = registerAs('services', ()=> {
   return {
        auth: {
          url: process.env.AUTH_SERVICE_URL,
          timeout: 8000,
        },
        audit: {
          url: process.env.AUDIT_TRAIL_SERVICE_URL,
          timeout: 8000,
        },
        payment: {
          url: process.env.PAYMENT_SERVICE_URL,
          timeout: 8000,
        },
        notification: {
          url: process.env.NOTIFICATION_SERVICE_URL,
          timeout: 8000,
        },
      }
})