// src/common/base/interfaces/filtering-rule.interface.ts

import { FilterRule } from "src/common/constants/api-query.enum";


export interface IFilteringRule {
    property: string;
    rule: FilterRule;
    value: any;
}