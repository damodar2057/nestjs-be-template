//

import { Module, Global } from "@nestjs/common";
import { AuditTrailApiClient } from "src/integrations/clients/audit-trail.client";
import { AuthApiClient } from "./integrations/clients/auth.client";

@Global()
@Module({
  providers: [
    AuditTrailApiClient,
    AuthApiClient,
    

 // Add more services as needed
  ],
  exports: [
    AuditTrailApiClient,
    AuthApiClient,
     // Ensure they are exported so other modules can use them
  ],
})
export class GlobalServicesModule {}
