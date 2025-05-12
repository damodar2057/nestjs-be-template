// src/common/helpers/typeorm-filter.helper.ts

import { Injectable } from "@nestjs/common";
import { IFilteringRule } from "../../common/base/interfaces/filtering-rule.interface";
import { Between, FindOperator, ILike, In, IsNull, LessThan, LessThanOrEqual, MoreThan, MoreThanOrEqual, Not } from "typeorm";
import { FilterRule } from "../../common/constants/api-query.enum";

/** 
 * Converts filters rule to typeorm conditions
 */

@Injectable()
export class TypeOrmFilterHelper {
    
    public buildWhereConditions(filters: IFilteringRule[]): Record<string, any> {
        const whereConditions: Record<string, any> = {};
        filters?.forEach((filter) => {
            whereConditions[filter.property] = this.convertFilterToTypeOrm(filter)
        })
        return whereConditions;
    }

    convertFilterToTypeOrm(filter: IFilteringRule): FindOperator<any> | any {
        switch (filter.rule) {
            case FilterRule.EQUALS:
                return filter.value;
            case FilterRule.NOT_EQUALS:
                return Not(filter.value)
            case FilterRule.GREATER_THAN:
                return MoreThan(filter.value)
            case FilterRule.GREATER_THAN_OR_EQUALS:
                return MoreThanOrEqual(filter.value)
            case FilterRule.LESS_THAN:
                return LessThan(filter.value)
            case FilterRule.LESS_THAN_OR_EQUALS:
                return LessThanOrEqual(filter.value);
            case FilterRule.LIKE:
                return ILike(`%${filter.value}%`);
            case FilterRule.NOT_LIKE:
                return Not(ILike(`%${filter.value}%`));
            case FilterRule.IN:
                return In(filter.value);
            case FilterRule.NOT_IN:
                return Not(In(filter.value))
            case FilterRule.IS_NULL:
                return IsNull();
            case FilterRule.IS_NOT_NULL:
                return Not(IsNull());
            case FilterRule.BETWEEN:
                return Between(filter?.value[0], filter?.value[1])
            default:
                return filter.value
        }
    }
}