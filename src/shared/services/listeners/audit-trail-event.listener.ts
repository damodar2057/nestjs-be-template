//

import { Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import {  OnEvent } from "@nestjs/event-emitter";
import { ParkingEvents } from "src/common/constants/event.enum";
import { GenerateAuditTrailEvent } from "src/common/events/audit-trail.event";
import { AuditTrailApiClient } from "src/integrations/clients/audit-trail.client";



@Injectable()
export class AuditTrailEventListener {
    private logger = new Logger(AuditTrailEventListener.name)
    constructor(
        private readonly auditTrailApiClient: AuditTrailApiClient
    ){}


    @OnEvent(ParkingEvents.GENERATE_AUDIT_TRAIL)
    async generateAuditLogs(dto: GenerateAuditTrailEvent){
        try {
            await this.auditTrailApiClient.create({
                appId: dto.appId,
                userId: dto?.userId.toString(),
                ...dto
            })
            this.logger.log("Successfully generated audit trail!!")
        } catch (error) {
            this.logger.error(`Error generating audit trail: ${error.message}`, error.stack);
            throw new InternalServerErrorException(error)
        }
    }
}