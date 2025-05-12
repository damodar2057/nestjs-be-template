// src/modules/demo/dtos/demo.dto.ts

import { IsBoolean, IsString, Max } from "class-validator";

export class CreateDemoDto {
    @IsString()
    @Max(255)
    name: string;

    @IsBoolean()
    isActive: boolean
}