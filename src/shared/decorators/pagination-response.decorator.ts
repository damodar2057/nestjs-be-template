// src/common/decorators/pagination-response.decorator.ts

import { IPaginatedResult } from "src/common/base/generics/pagination-included-response.interface";



/**
 * Automatically wraps the result of a method with pagination metadata
 */

export function PaginationResponse() {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = async function <T>(...args: any[]): Promise<IPaginatedResult<T>> {
            const query = args[0]?.query || {};
            if (!query) {
                // if query not present no need for pagination
                return;
            }

            // call the original method
            const { data, total } = await originalMethod.apply(this, args);

            // build paginated response
            return {
                data,
                pagination: {
                    currentPage: Number(query?.page || 1),
                    itemsPerPage: Number(query?.pageSize || 10),
                    totalItems: Number(total),
                    totalPages: Number(Math.ceil(total / (query?.pageSize || 10))),
                }
            }
        }
        return descriptor;
    }
}