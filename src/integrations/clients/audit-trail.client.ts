// src/integration/clients/audit-trial.client.ts


import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MICROSERVICES } from 'src/common/constants/service.enum';
import { QueryDto } from 'src/shared/dtos/query.dto';
import { HttpService, HttpServiceClient } from 'src/shared/services/http/http.util';


@Injectable()
export class AuditTrailApiClient {
  private readonly logger = new Logger(AuditTrailApiClient.name);
  private client: HttpServiceClient;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.client = this.httpService.createClient({
      baseURL: this.configService.get<string>('services.audit.url'),
      serviceName: MICROSERVICES.AUDIT_TRAIL_SERVICE,
    });
  }

  async getById(id: string): Promise<any> {
    try {
      const response = await this.client.get<any>(`/audit-trails/${id}`);
      return response;
    } catch (error) {
      this.logger.error(`Error fetching audit trail with ID ${id}`, error);
      throw error;
    }
  }

  async getAll(query: QueryDto): Promise<{ data: any[]; total: number }> {
    try {
      const response = await this.client.get<{ data: any[]; total: number }>(
        '/audit-trails',
        { params: query ,
        },
      );
      return response;
    } catch (error) {
      this.logger.error('Error fetching audit trails', error);
      throw error;
    }
  }

  async create(dto: any): Promise<any> {
    try {
      
      const response = await this.client.post<any>('/audit-trails', JSON.stringify({
        ...dto,
        userId: dto?.userId.toString()
      }));
      return response;
    } catch (error) {
      this.logger.error('Error creating audit trail', error);
      throw error;
    }
  }

  async delete(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await this.client.delete<{ success: boolean; message: string }>(
        `/audit-trails/${id}`
      );
      return response;
    } catch (error) {
      this.logger.error(`Error deleting audit trail with ID ${id}`, error);
      throw error;
    }
  }

  async getAllComposite(query: QueryDto): Promise<{ data: any[]; total: number }> {
    try {
      const response = await this.client.get<{ data: any[]; total: number }>(
        '/audit-trails/composite',
        { params: query }
      );
      return response;
    } catch (error) {
      this.logger.error('Error fetching composite audit trails', error);
      throw error;
    }
  }

  async getByIdComposite(id: string): Promise<any> {
    try {
      const response = await this.client.get<any>(`/audit-trails/composite/${id}`);
      return response;
    } catch (error) {
      this.logger.error(`Error fetching composite audit trail with ID ${id}`, error);
      throw error;
    }
  }
}
