/* eslint-disable prettier/prettier */
import { IsBoolean, IsOptional, IsString } from "class-validator";

export class CreateLeitoDto {
    @IsString()
    @IsOptional()
    ala?: string;

    @IsOptional()
    @IsString()
    numeroLeito?: string;

    @IsOptional()
    @IsBoolean()
    ocupado?: boolean;
}