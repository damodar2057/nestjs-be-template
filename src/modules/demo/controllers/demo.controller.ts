// src/modules/demo/controllers/demo.controller.ts

import {
  Controller,
  Delete,
  Get,
  Inject,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { IDemoService } from '../interfaces/demo-service.interface';
import { DemoEntity } from '../entities/demo.entity';
import { FindOptionsWhere } from 'typeorm';
import { ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateDemoDto } from '../dtos/demo.dto';
import { TypeOrmFilterHelper } from 'src/shared/utils/typeorm-filter.helper';
import { PaginationResponse } from 'src/shared/decorators/pagination-response.decorator';
import { QueryDto } from 'src/shared/dtos/query.dto';

@ApiTags('Demo')
@Controller('demo')
export class DemoController {
  private logger = new Logger(DemoController.name);
  constructor(
    @Inject('IDemoService')
    private readonly demoService: IDemoService,

    private readonly filterHelper: TypeOrmFilterHelper,
  ) {}

  @Get(':id')
  async get(@Req() request): Promise<void> {
    try {
    } catch (error) {
      throw error;
    }
  }

  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'pageSize', required: false, type: Number, example: 10 })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    type: String,
    example: 'createdAt',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    enum: ['ASC', 'DESC'],
    example: 'DESC',
  })
  @Get()
  @PaginationResponse()
  async getAll(
    @Req() request,
    @Query() query: QueryDto,
  ): Promise<{ data: DemoEntity[]; total: number }> {
    try {
      let options: FindOptionsWhere<DemoEntity> = {};

      return await this.demoService.findAndCount({
        skip: (query?.page - 1) * query.pageSize,
        take: query?.pageSize,
        order: {
          [query?.sortBy]: query?.sortOrder,
        },
        relations: {},
        where: {
          ...this.filterHelper.buildWhereConditions(query?.filters),
          ...options,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  @ApiBody({ type: CreateDemoDto })
  @Post()
  async create(@Req() request): Promise<void> {
    try {
    } catch (error) {
      throw error;
    }
  }

  @Patch(':id')
  async update(@Req() request, @Param() id: string): Promise<void> {
    try {
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  async remove(@Req() request, @Param('id') id: string): Promise<void> {
    try {
    } catch (error) {
      throw error;
    }
  }
}
