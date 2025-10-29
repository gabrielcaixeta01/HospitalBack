/* eslint-disable prettier/prettier */
import { IsOptional, IsString, IsInt } from 'class-validator';

export class UpdateExameDto {
    @IsOptional()
    @IsInt()
    consultaId?: bigint;

    @IsString()
    @IsOptional()
    tipo?: string;

    @IsString()
    @IsOptional()
    resultado?: string;
}
