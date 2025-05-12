// src/shared/http/circuit-breaker.service.ts

// src/shared/http/circuit-breaker.service.ts
import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CircuitBreaker } from './circuit-breaker';

export enum CircuitState {
  CLOSED = 'CLOSED',
  OPEN = 'OPEN',
  HALF_OPEN = 'HALF_OPEN',
}

export interface CircuitBreakerOptions {
  failureThreshold?: number;
  resetTimeout?: number;
  requestTimeout?: number;
}

/**
 * Circuit Breaker implementation for service resilience
 */
@Injectable()
export class CircuitBreakerService {
  private readonly logger = new Logger(CircuitBreakerService.name);
  private readonly eventEmitter: EventEmitter2;
  
  constructor(eventEmitter: EventEmitter2) {
    this.eventEmitter = eventEmitter;
  }

  /**
   * Creates a new circuit breaker instance
   */
  create(serviceName: string, options: CircuitBreakerOptions = {}){
    return new CircuitBreaker(serviceName, this.eventEmitter, options);
  }
}