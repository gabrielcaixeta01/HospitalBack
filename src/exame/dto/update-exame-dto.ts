/* eslint-disable prettier/prettier */
import { IsOptional, IsString } from 'class-validator';

export class UpdateExameDto {
    @IsOptional()
    consultaId?: bigint;

    @IsString()
    @IsOptional()
    tipo?: string;

    @IsString()
    @IsOptional()
    resultado?: string;
}
