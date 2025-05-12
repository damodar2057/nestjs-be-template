//

import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";


export interface RetryOptions {
    retries?: number;
    factor?: number;
    minTimeout?: number;
    maxTimeout?: number;
    randomize?: boolean;
    onRetry?: (error: Error, attempt: number) => void;
  }


  /** Service implementing retry logic with exponential backoff */
  @Injectable()
  export class RetryService {
    private readonly logger = new Logger(RetryService.name)
    private readonly defaultOptions: RetryOptions;

    constructor(private readonly configService: ConfigService ){
        this.defaultOptions = {
            retries: this.configService.get<number>('retry.defaultRetries', 3),
            factor: this.configService.get<number>('retry.factor', 2),
            minTimeout: this.configService.get<number>('retry.minTimeout', 1000),
            maxTimeout: this.configService.get<number>('retry.maxTimeout', 300000),
            randomize: this.configService.get<boolean>('retry.randomize', true),
        }
    }


    // Executes an operation with retry logic
    async execute<T>(
        operation: () => Promise<T>,
        options: RetryOptions = {}
    ): Promise<T> {
        const config = { ...this.defaultOptions, ...options}
        const retries = config.retries!;
        const factor = config.factor!;
        const minTimeout = config.minTimeout!;
        const maxTimeout = config.maxTimeout!;
        const randomize = config.randomize!;
        const onRetry = config.onRetry;

        let attempt = 0;
        let lastError: Error;

        while (attempt <= retries){
            try {
                return await operation();
            } catch (error) {
                attempt++;
                lastError = error;

                if (attempt > retries){
                    throw error;
                }

                if (this.isRetryableError(error)){
                    // Calculate delay with exponential backoff
                    let delay = Math.min(
                        maxTimeout,
                        minTimeout * Math.pow(factor, attempt - 1)
                    );

                    // Add randomization to prevent thundering herd
                    if (randomize){
                        delay = Math.floor(delay * (0.5 + Math.random()))
                    }

                    // call onRetry callback if needed
                    if (onRetry){
                        onRetry(error, attempt)
                    }

                    // Log retry attempt
                    this.logger.warn(`Retrying operation (${attempt}/${retries}) after ${delay}ms: ${error.message}`)

                    // Wait before retrying
                    await new Promise(resolve => setTimeout(resolve, delay))
                } else {
                    // Non-retryable error
                    this.logger.error(`Non-retryable error, aborting retry: ${error.message}`)
                    throw error
                }
            }
        }

        // Should never get here
        throw lastError
    }


    /** Determines if an error is retryable */
    private isRetryableError(error: any): boolean {
        // Network related errors
        if (!error.response && error.code) {
          const networkErrors = [
            'ECONNRESET', 'ETIMEDOUT', 'ECONNREFUSED', 'ENOTFOUND', 'ENETUNREACH'
          ];
          
          if (networkErrors.includes(error.code)) {
            return true;
          }
        }
    
        // HTTP status codes that may indicate transient errors
        if (error.response) {
          const retryableStatusCodes = [408, 429, 500, 502, 503, 504];
          return retryableStatusCodes.includes(error.response.status);
        }
    
        // Timeout errors
        if (error.message && error.message.toLowerCase().includes('timeout')) {
          return true;
        }
    
        // Default to not retrying
        return false;
      }
}