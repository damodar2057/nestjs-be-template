// src/common/decorators/catch-db-error.decorator.ts

import { DatabaseErrorHandler } from "src/shared/utils/db-error-handler.util";


/** *** STRICTLY USED TO CATCH ONLY DB ERRORS *****
 * This decorator must be applied in repository,
 * cause it is made to handle db error.
 * If we apply this in other type of method from different classes,
 * it will return it as a db error
 *
 */
export function CatchDatabaseError() {
    return function(target: any, propertyKey: string, descriptor: PropertyDescriptor){
        const originalMethod = descriptor.value;

        descriptor.value = async function (...args: any[]) {
            try {
                return await originalMethod.apply(this, args)
            } catch (error) {
                const errorHandler = this.databaseErrorHandler;

                if(!(errorHandler instanceof DatabaseErrorHandler)) {
                    throw error
                }
                errorHandler.handleError(error)
            }
        }
        return descriptor
    }
}