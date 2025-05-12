// src/common/base/interfaces/pagination-included-response.interface.ts

import { IPaginationRes } from "../interfaces/pagination-response.interface";



export interface IPaginatedResult<T> {
    data: T[],
    pagination: IPaginationRes
}