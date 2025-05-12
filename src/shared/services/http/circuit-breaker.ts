//

import { EventEmitter2 } from "@nestjs/event-emitter";
import { CircuitBreakerOptions, CircuitState } from "./circuit-breaker.service";
import { Logger } from "@nestjs/common";

/**
 * Individual circuit breaker instance
 */
export class CircuitBreaker {
    private readonly logger = new Logger(CircuitBreaker.name);
    private state: CircuitState = CircuitState.CLOSED;
    private failureCount = 0;
    private successCount = 0;
    private nextAttempt = Date.now();
    private readonly healthCheckTimer: NodeJS.Timeout;
    private readonly serviceName: string;
    private readonly eventEmitter: EventEmitter2;
  
    // Configuration with defaults
    private readonly failureThreshold: number;
    private readonly resetTimeout: number;
    private readonly requestTimeout: number;
  
    constructor(
      serviceName: string,
      eventEmitter: EventEmitter2,
      options: CircuitBreakerOptions = {}
    ) {
      this.serviceName = serviceName;
      this.eventEmitter = eventEmitter;
      
      this.failureThreshold = options.failureThreshold || 5;
      this.resetTimeout = options.resetTimeout || 30000;
      this.requestTimeout = options.requestTimeout || 3000;
  
      // Start health monitoring
      this.healthCheckTimer = setInterval(() => this.emitHealth(), 10000);
      
      this.logger.log(`Circuit breaker initialized for service: ${this.serviceName}`);
    }
  
    /**
     * Executes a function with circuit breaker protection
     */
    async execute<T>(request: () => Promise<T>): Promise<T> {
      // Check if circuit is open
      if (this.state === CircuitState.OPEN) {
        if (Date.now() < this.nextAttempt) {
          // Still in timeout period, fail fast
          this.emitRejected();
          throw new Error(`Service ${this.serviceName} is unavailable (Circuit open)`);
        }
        
        // Move to half-open state to test the service
        this.transitionToState(CircuitState.HALF_OPEN);
      }
      
      try {
        // Add timeout to the request if not already present
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error('Request timeout')), this.requestTimeout);
        });
        
        // Execute the request with a timeout
        const response = await Promise.race([request(), timeoutPromise]);
        
        // Request succeeded
        this.handleSuccess();
        return response;
      } catch (error) {
        // Request failed
        this.handleFailure(error);
        throw error;
      }
    }
  
    /**
     * Handles successful request
     */
    private handleSuccess(): void {
      if (this.state === CircuitState.CLOSED) {
        this.failureCount = 0;
        this.emitSuccess();
        return;
      }
      
      if (this.state === CircuitState.HALF_OPEN) {
        this.successCount++;
        
        // After enough successes, close the circuit
        if (this.successCount >= 2) {
          this.transitionToState(CircuitState.CLOSED);
          this.emitClose();
        }
      }
    }
  
    /**
     * Handles failed request
     */
    private handleFailure(error: Error): void {
      if (this.state === CircuitState.CLOSED) {
        this.failureCount++;
        
        if (this.failureCount >= this.failureThreshold) {
          this.transitionToState(CircuitState.OPEN);
          this.emitOpen(error.message);
        }
      } else if (this.state === CircuitState.HALF_OPEN) {
        this.transitionToState(CircuitState.OPEN);
        this.emitReopen(error.message);
      }
    }
  
    /**
     * Transitions the circuit to a new state
     */
    private transitionToState(newState: CircuitState): void {
      this.state = newState;
      
      if (newState === CircuitState.OPEN) {
        this.nextAttempt = Date.now() + this.resetTimeout;
      } else if (newState === CircuitState.HALF_OPEN) {
        this.successCount = 0;
      } else if (newState === CircuitState.CLOSED) {
        this.failureCount = 0;
        this.successCount = 0;
      }
      
      this.logger.log(`Circuit state changed to ${newState} for service: ${this.serviceName}`);
    }
  
    /**
     * Event emission methods
     */
    private emitOpen(errorMessage: string): void {
      this.eventEmitter.emit('circuit.open', {
        service: this.serviceName,
        error: errorMessage,
      });
    }
  
    private emitClose(): void {
      this.eventEmitter.emit('circuit.close', {
        service: this.serviceName,
      });
    }
  
    private emitHalfOpen(): void {
      this.eventEmitter.emit('circuit.half-open', {
        service: this.serviceName,
      });
    }
  
    private emitRejected(): void {
      this.eventEmitter.emit('circuit.rejected', {
        service: this.serviceName,
      });
    }
  
    private emitSuccess(): void {
      this.eventEmitter.emit('circuit.success', {
        service: this.serviceName,
      });
    }
  
    private emitReopen(errorMessage: string): void {
      this.eventEmitter.emit('circuit.reopen', {
        service: this.serviceName,
        error: errorMessage,
      });
    }
  
    private emitHealth(): void {
      this.eventEmitter.emit('circuit.health', {
        service: this.serviceName,
        state: this.state,
        failureCount: this.failureCount,
        successCount: this.successCount,
        nextAttempt: this.nextAttempt > Date.now() ? 
          Math.round((this.nextAttempt - Date.now()) / 1000) : 0,
      });
    }
  
    /**
     * Register event listeners
     */
    onOpen(listener: (data: any) => void): () => void {
      const eventName = `circuit.open`;
      this.eventEmitter.on(eventName, listener);
      return () => this.eventEmitter.removeListener(eventName, listener);
    }
  
    onClose(listener: (data: any) => void): () => void {
      const eventName = `circuit.close`;
      this.eventEmitter.on(eventName, listener);
      return () => this.eventEmitter.removeListener(eventName, listener);
    }
  
    onHalfOpen(listener: (data: any) => void): () => void {
      const eventName = `circuit.half-open`;
      this.eventEmitter.on(eventName, listener);
      return () => this.eventEmitter.removeListener(eventName, listener);
    }
  
    /**
     * Cleans up resources used by this circuit breaker
     */
    shutdown(): void {
      clearInterval(this.healthCheckTimer);
    }
  }
  