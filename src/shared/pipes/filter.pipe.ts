// src/common/pipes/filter.pipe.ts

import { Injectable, PipeTransform, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { IFilteringRule } from '../../common/base/interfaces/filtering-rule.interface';
import { FilterRule } from '../../common/constants/api-query.enum';
import { isObject } from 'class-validator';


export const keysToOmit = ['page', 'pageSize', 'sortOrder', 'sortBy']


@Injectable()
export class FilterPipe implements PipeTransform {
    private readonly ruleDelimiter = ':';

    /**
     * Extract the filter rule and value from a query parameter
     * Format fieldName:rule=value
     * Example: name:john, age:gt=25
     */
    private extractFilterRule(key:string, value: string): IFilteringRule {
        const [property, rule]= key.split(this.ruleDelimiter);

        if(!property){
            throw new BadRequestException(`Invalid filter property in: ${key}`)
        }


        // If no rule is specified, default to EQUALS
        const filterRule = rule ? Object.values(FilterRule).find(r => r === rule): FilterRule.EQUALS;

        if (rule && !filterRule) {
            throw new BadRequestException(`Invalid filter rule: ${rule}`)
        }

        let parsedValue: any = value;

        // Handle different value types
        if (filterRule === FilterRule.IN || filterRule === FilterRule.NOT_IN){
            parsedValue = value.split(',').map(v => this.parseValue(v.trim()))
        }else if(filterRule === FilterRule.IS_NULL || filterRule === FilterRule.IS_NOT_NULL) {
            parsedValue = null;
        }
         else {
            parsedValue = this.parseValue(value);
        }

        return {
            property,
            rule: filterRule,
            value: parsedValue
        }
    }


    /**
     *  Parses string values into appropriate types
     */
    private parseValue(value: string): any {
        if (value.toLowerCase() === 'true') return true;
        if (value.toLowerCase() === 'false') return false;
        if (value.toLowerCase() === 'null') return null;
        if (!isNaN(Number(value))) return Number(value);
        return value;

    }


    transform(value: any, metadata: ArgumentMetadata) {
        if (metadata.type !== 'query' || !isObject(value)) {
            return value;
        }

        const filters: IFilteringRule[] = []
        const remainingQuery: any = {}

        // Process each query parameter
        Object.entries(value).forEach(([key, val]) => {
            if (keysToOmit.includes(key)) {
                remainingQuery[key] = val;
                return;
            }

            try {
                if (typeof val === 'string') {
                    filters.push(this.extractFilterRule(key, val))
                }
            } catch (error) {
                throw new BadRequestException(`Error processing filter: #${error.message}`)
                
            }
        });

        // return transformed query with filters
        return {
            ...remainingQuery,
            filters: filters.length > 0 ? filters : undefined
        }

    }
}