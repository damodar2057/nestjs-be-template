// src/common/base/interfaces/db-error-handler.interface.ts


export interface IDatabaseErrorHandler {
    handleError(error: any): never;
}