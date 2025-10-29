/* eslint-disable prettier/prettier */
import { IsBoolean, IsOptional, IsString } from "class-validator";

export class CreateLeitoDto {
    @IsString()
    @IsOptional()
    ala?: string;

    @IsOptional()
    numeroLeito?: number;

    @IsOptional()
    @IsBoolean()
    ocupado?: boolean;
}