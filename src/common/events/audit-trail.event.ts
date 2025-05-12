//


export class GenerateAuditTrailEvent {
    constructor(public appId: string, public eventName: string, public endPoint: string, public request: any, public response: any, public userEmail: string,public  userPhone: string, public userId: string) {}
}