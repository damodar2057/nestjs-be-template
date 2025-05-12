// src/integrations/clients/auth.client.ts

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MICROSERVICES } from 'src/common/constants/service.enum';
import { AuthProxyException } from 'src/common/exceptions/auth-proxy.exception';

import {
  HttpService,
  HttpServiceClient,
} from 'src/shared/services/http/http.util';

export interface IAuthentikGroupRes {
  pk: string;
  numPk: number;
  name: string;
  isSuperuser: boolean;
  parentName: string | null;
  users: any[]; // You can replace `any[]` with a specific type if needed
  usersObj: any[];
  attributes: Record<string, any>; // Represents an object with dynamic key-value pairs
  roles: any[];
  rolesObj: any[];
}

@Injectable()
export class AuthApiClient {
  deleteGroup(pk: any) {
    throw new Error('Method not implemented.');
  }
  private readonly logger = new Logger(AuthApiClient.name);
  private client: HttpServiceClient;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.client = this.httpService.createClient({
      baseURL:
        this.configService.get<string>('services.auth.url'),
      serviceName: MICROSERVICES.AUTH_PROXY_SERVICE,
      useCircuitBreaker: true,
      retries: 5,
    });
  }

  async getGroups(): Promise<IAuthentikGroupRes[]> {
    try {
      const response = await this.client.get('/groups');
      return response.data!;
    } catch (error) {
      this.logger.error('Error fetching groups', error);
      throw error;
    }
  }

  async getUsers(): Promise<any> {
    try {
      const response = await this.client.get('/users');
      return response.data;
    } catch (error) {
      this.logger.error('Error fetching users', error);
      throw error;
    }
  }

  async createUser(dto: any): Promise<any> {
    try {
      const response = await this.client.post('/users', JSON.stringify(dto));
      
      return response.data;
    } catch (error) {
      if (error.response.data) {
        throw new AuthProxyException(
          error.response.data.message,
          error.response.code,
          error.response.data.statusCode,
          error.response.data.details,
        );
      }
      this.logger.error('Error creating user', error);
      throw error;
    }
  }

  async setUserPassword(userId: string,setPasswordDto: any): Promise<any> {
    try {  
      const response = await this.client.post(
        `/users/${userId}/set-password`,
        JSON.stringify(setPasswordDto),
      );
      return response.data;
    } catch (error) {
      if (error.response?.data) {
        throw new AuthProxyException(
          error.response.data.message,
          error.response.code,
          error.response.data.statusCode,
          error.response.data.details,
        );
      }
      this.logger.error('Error setting password', error);
      throw error;
    }
  }

  
  async deleteUser(id: string): Promise<void> {
    try {
      const response = await this.client.delete(`/users/${id}`);
      return response.data;
    } catch (error) {
      if (error.response.data) {
        throw new AuthProxyException(
          error.response.data.message,
          error.response.code,
          error.response.data.statusCode,
          error.response.data.details,
        );
      }
      this.logger.error('Error deleting user', error);
      throw error;
    }
  }


  async getScopes(): Promise<any> {
    try {
      const response = await this.client.get('/scopes');
      return response.data;
    } catch (error) {
      this.logger.error('Error fetching scopes', error);
      throw error;
    }
  }
}
