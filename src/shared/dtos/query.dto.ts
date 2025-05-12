// src/common/base/dtos/query.dto.ts
import { IsArray, IsInt, IsOptional, Min } from 'class-validator';
import { Transform } from 'class-transformer';
import { IFilteringRule } from '../../common/base/interfaces/filtering-rule.interface';


export class QueryDto {

    @IsOptional()
    @IsInt()
    @Min(1)
    @Transform(({ value }) => parseInt(value, 10))
    page?: number = 1;


    @IsOptional()
    @IsInt()
    @Min(1)
    @Transform(({ value }) => parseInt(value, 10))
    pageSize?: number = 10;


    @IsOptional()
    sortBy?: string = 'createdAt'


    @IsOptional()
    sortOrder?: 'ASC' | 'DESC' = 'DESC'

    @IsOptional()
    @IsArray()
    filters?: IFilteringRule[]

}