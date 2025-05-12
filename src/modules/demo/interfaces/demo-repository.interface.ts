// src/modules/demo/interfaces/demo-repository.interface.ts

import { IBaseRepository } from "src/common/base/interfaces/base-repository.interface";
import { DemoEntity } from "../entities/demo.entity";


export interface IDemoRepository extends IBaseRepository<DemoEntity> {}