// src/modules/fmcsa/interfaces/demo-service.interface.ts

import { IBaseService } from "src/common/base/interfaces/base-service.interface";
import { DemoEntity } from "../entities/demo.entity";


export interface IDemoService extends IBaseService<DemoEntity> {}