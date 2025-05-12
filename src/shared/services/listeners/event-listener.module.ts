//

import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuditTrailEventListener } from './audit-trail-event.listener';
import { AuditTrailApiClient } from 'src/integrations/clients/audit-trail.client';

@Global()
@Module({
  imports: [],
  providers: [
    AuditTrailEventListener,
    AuditTrailApiClient,
,
  ],
  exports: [AuditTrailEventListener],
})
export class EventListenerModule {}
