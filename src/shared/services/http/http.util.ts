// src/utils/http.util.ts

import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosRequestConfig, AxiosInstance, AxiosResponse } from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { CircuitBreakerService } from './circuit-breaker.service';
import { RetryService } from './retry.util';
import { CircuitBreaker } from './circuit-breaker';
import { stringify } from 'flatted';

export interface HttpServiceClient {
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
  post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T>;
  put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T>;
  patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T>;
  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
  axiosInstance: AxiosInstance; // for raw access
}
export interface HttpServiceOptions {
  baseURL: string;
  serviceName: string;
  timeout?: number;
  retries?: number;
  useCircuitBreaker?: boolean;
  failureThreshold?: number;
  resetTimeout?: number;
  headers?: Record<string, string>;

  serviceAccountName?: string;
  token?: string;
}

@Injectable()
export class HttpService implements OnModuleDestroy {
  private readonly logger = new Logger(HttpService.name);
  private readonly defaultOptions: Partial<HttpServiceOptions>;
  private serviceClients: Map<
    string,
    {
      axiosInstance: AxiosInstance;
      circuitBreaker?: CircuitBreaker;
    }
  > = new Map();

  constructor(
    private readonly configService: ConfigService,
    private readonly retryService: RetryService,
    private readonly circuitBreakerFactory: CircuitBreakerService,
  ) {
    this.defaultOptions = {
      timeout: this.configService.get<number>('http.defaultTimeout'),
      retries: this.configService.get<number>('http.defaultRetries'),
      useCircuitBreaker: this.configService.get<boolean>(
        'http.useCircuitBreaker',
      ),
      failureThreshold: this.configService.get<number>('http.failureThreshold'),
      resetTimeout: this.configService.get<number>('http.resetTimeout'),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }

  /**
   * Creates an HTTP Client for a specific service
   * @param options service config options
   * @returns service client with wrapped HTTP methods
   */
  createClient(options: HttpServiceOptions): HttpServiceClient {
    const config: HttpServiceOptions = {
      ...this.defaultOptions,
      ...options,
    };

    const { serviceName } = config;

    // create an axios instance with base config
    const axiosInstance = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout,
      headers: config.headers,
    });

    // Add request interceptor for tracing and logging
    axiosInstance.interceptors.request.use((request) => {
      // Add correlation ID for request tracing
      const correlationId = uuidv4();
      request.headers['X-Correlation-ID'] = correlationId;
      request.headers['X-Request-ID'] = correlationId;

      this.logger.debug(
        `Outgoing request to ${config.serviceName}: ${request.method?.toUpperCase()} ${request.url}`,
        { correlationId },
      );

      return request;
    });

    // Add response interceptor for logging
    axiosInstance.interceptors.response.use(
      (response) => {
        const correlationId = response.config.headers['X-Correlation-ID'];
        this.logger.debug(
          `
                        Response from ${config.serviceName}: ${response.status},
                        `,
          correlationId,
        );

        return response;
      },
      (error) => {
        // console.log(error.response)
        const correlationId = error.config?.headers['X-Correlation-ID'];
        this.logger.error(
          `
                        Error from ${config.serviceName}: ${error.message},
                        `,
          {
            status: error.response?.status,
            correlationId,
            url: error.config?.url,
            method: error.config?.method?.toUpperCase(),
          },
        );

        return Promise.reject(error);
      },
    );

    // Create the circuit breaker if enabled
    let circuitBreaker: CircuitBreaker | undefined;
    if (config.useCircuitBreaker) {
      circuitBreaker = this.circuitBreakerFactory.create(serviceName, {
        failureThreshold: config.failureThreshold,
        resetTimeout: config.resetTimeout,
      });

      // Add circuit breaker event listener
      circuitBreaker.onOpen(() => {
        this.logger.warn(`Circuit opened for service: ${serviceName}`);
      });

      circuitBreaker.onClose(() => {
        this.logger.log(`Circuit closed for service: ${serviceName}`);
      });

      circuitBreaker.onHalfOpen(() => {
        this.logger.log(`Circuit half-open for service ${serviceName}`);
      });
    }

    // Store the client in our map
    this.serviceClients.set(serviceName, {
      axiosInstance,
      circuitBreaker,
    });

    // Return the wrapped client interfaces
    return {
      get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> =>
        this.executeRequest<T>(serviceName, 'get', url, undefined, config),

      post: <T = any>(
        url: string,
        data?: any,
        config?: AxiosRequestConfig,
      ): Promise<T> =>
        this.executeRequest<T>(serviceName, 'post', url, data, config),

      put: <T = any>(
        url: string,
        data?: any,
        config?: AxiosRequestConfig,
      ): Promise<T> =>
        this.executeRequest<T>(serviceName, 'put', url, data, config),

      patch: <T = any>(
        url: string,
        data?: any,
        config?: AxiosRequestConfig,
      ): Promise<T> =>
        this.executeRequest<T>(serviceName, 'patch', url, data, config),

      delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> =>
        this.executeRequest<T>(serviceName, 'delete', url, undefined, config),

      // raw access to axios instance if needed
      axiosInstance,
    };
  }

  // Executes an HTTP request with a circuit breaker and retry capabilities
  private async executeRequest<T>(
    serviceName: string,
    method: string,
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const client = this.serviceClients.get(serviceName);
    if (!client) {
      throw new Error(`Http Client for service ${serviceName} not initialized`);
    }

    const { axiosInstance, circuitBreaker } = client;

    // Create the request function
    const executeAxiosRequest = async (): Promise<T> => {
      const response = await axiosInstance.request<T>({
        method,
        url,
        data: data, // Convert circular structure
        ...config,
      });
      return response.data;
    };

    // If using circuit breaker, wrap with it
    if (circuitBreaker) {
      return this.retryService.execute(() => {
        // todo
        return circuitBreaker.execute(() => executeAxiosRequest());
      });
    } else {
      // otherwise just retry
      return this.retryService.execute(executeAxiosRequest);
    }
  }

  // Cleanup resources when the module is destroyed
  onModuleDestroy() {
    for (const [serviceName, client] of this.serviceClients.entries()) {
      if (client.circuitBreaker) {
        client.circuitBreaker.shutdown();
      }

      this.logger.log(`Shutting down HTTP Client for service ${serviceName}`);
    }
    throw new Error('Method not implemented.');
  }
}
