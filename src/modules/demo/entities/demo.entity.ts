// src/modules/fmcsa/entities/fmcsa.entity.ts

import { BaseEntity } from "src/common/abstract/base.entity";
import { DATABASE_TABLES } from "src/common/constants/db.enum";
import {  Column, Entity } from "typeorm";


@Entity({name: DATABASE_TABLES.DEMO})
export class DemoEntity extends BaseEntity {
  
    @Column({ type: "varchar", length: 255, nullable: false })
    name: string;
  
    @Column({ type: "boolean", default: true })
    isActive: boolean;
}