//

import { Global, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { HttpService } from "./http.util";
import { CircuitBreakerService } from "./circuit-breaker.service";
import { RetryService } from "./retry.util";


@Global()
@Module({
    imports: [
        ConfigModule,
        EventEmitterModule.forRoot()
    ],
    providers: [
        HttpService,
        CircuitBreakerService,
        RetryService
    ],
    exports: [HttpService]
})
export class HttpModule {}