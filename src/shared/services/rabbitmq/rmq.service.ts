//

import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { AmqpConnectionManager, connect, Options } from "amqp-connection-manager";
import ChannelWrapper, { Channel } from "amqp-connection-manager/dist/types/ChannelWrapper";
import { RmqQueues, RmqExchanges, RmqRoutingKeys } from "src/common/constants/rmq.enum";

@Injectable()
export class RmqService implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(RmqService.name);
    private connection: AmqpConnectionManager;
    private channel: ChannelWrapper;
    private isInitialized = false;
    
    constructor(private readonly config: Options.Connect) { }
    async onModuleDestroy() {
        await this.close()
    }
    
    async onModuleInit() {
       await this.initialize();
    }

    async initialize() {
        this.connection = connect([this.config], {
            heartbeatIntervalInSeconds: 30,
            reconnectTimeInSeconds: 5
        });

        this.setUpConnectionHandlers();
        this.channel = this.createChannel();
        await this.channel.waitForConnect();

        await this.assertQueue();
        this.isInitialized = true;

        this.logger.debug(`Rmq initialized successfully!!!`);
    }

    private async assertQueue() {
        if (!this.channel) throw new Error(`Channel not initialized!!`);

        await this.channel.assertQueue(RmqQueues.EMAIL_INGESTION_QUEUE, {
            durable: true
        });

        // Bind queue
        await this.channel.bindQueue(RmqQueues.EMAIL_INGESTION_QUEUE, RmqExchanges.EMAIL_INGESTION_EXCHANGE, RmqRoutingKeys.EMAIL_INGESTION_ROUTING_KEY);

        this.logger.log(`Queue asserted successfully!!`);
    }

    private createChannel(): ChannelWrapper {
        if (!this.connection) {
            throw new Error(`Cannot create channel, No connection established`);
        }

        return this.connection.createChannel({
            json: true,
            setup: async (channel: Channel) => {
                this.logger.log(`Setting up a channel`);
                await channel.prefetch(10);
                await channel.assertExchange(
                    RmqExchanges.EMAIL_INGESTION_EXCHANGE, 
                    'direct', 
                    { durable: true }
                );
                this.logger.debug(`Channel Creating successfully!!!`)
                return;
            },
        });
    }

    private setUpConnectionHandlers() {
        if (!this.connection) return;

        this.connection.on('connect', () => {
            this.logger.log(`Connected to rmq!!!`);
        });

        this.connection.on('connectFailed', (err: Error) => {
            this.logger.error(`Connection failed to rabbitmq!!, error:${err}`);
        });

        this.connection.on('disconnect', (err: Error) => {
            this.logger.error(`Connection failed: ${err}`);
        });
    }

    async publishToQueue(message: unknown) {
        if (!this.channel && !this.isInitialized) throw new Error(`Client not initialized or channel not available`);

        try {
            this.logger.debug(`Publishing email to rabbitmq!!!`)
             await this.channel.publish(RmqExchanges.EMAIL_INGESTION_EXCHANGE, RmqRoutingKeys.EMAIL_INGESTION_ROUTING_KEY, message, { persistent: true });
            this.logger.debug(`Published to rmq successfully!!!`)
        } catch (error) {
            this.logger.error('Publish failed', error instanceof Error ? error.stack : String(error));
            throw error;
        }
    }

    async close(): Promise<void> {
        try {
            if (this.channel) {
                await this.channel.close();
            }
            if (this.connection) {
                await this.connection.close();
            }
            this.isInitialized = false;
            this.logger.log('Connection closed gracefully');
        } catch (error) {
            this.logger.error('Error during shutdown', error instanceof Error ? error.stack : String(error));
            throw error;
        }
    }
}