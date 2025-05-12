// src/common/base/interfaces/pagination-response.interface.ts

export interface IPaginationRes {
    totalItems: number,
    totalPages:number,
    currentPage: number,
    itemsPerPage: number     
}