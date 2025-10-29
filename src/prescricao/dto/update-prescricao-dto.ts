/* eslint-disable prettier/prettier */
import { IsOptional, IsString, IsInt } from "class-validator";

export class UpdatePrescricaoDto {
    @IsOptional()
    @IsInt()
    consultaId?: bigint;

    @IsString()
    @IsOptional()
    texto?: string;
}