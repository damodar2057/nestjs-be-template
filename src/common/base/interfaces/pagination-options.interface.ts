// src/common/base/interfaces/pagination-options.interface.ts



export interface IPaginationOptions {
    page?: number;
    pageSize?: number;
    sortBy?: string;  //it means by which field we should sort
    sortOrder?: 'ASC' | 'DESC'
}