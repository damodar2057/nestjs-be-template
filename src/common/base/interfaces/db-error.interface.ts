// src/common/base/interfaces/db-error.interface.ts

export interface IDatabaseError {
    code: string;
    detail?: string;
    table?: string;
    column?: string;
    driverError?: string;
}