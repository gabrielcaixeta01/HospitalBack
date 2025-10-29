/* eslint-disable prettier/prettier */
import { IsDate, IsOptional, IsInt } from "class-validator";


export class UpdateInternacaoDto {
    @IsOptional()
    @IsInt()
    pacienteId?: bigint;

    @IsOptional()
    @IsInt()
    leitoId?: bigint;

    @IsOptional()
    @IsDate()
    dataEntrada?: Date;

    @IsOptional()
    @IsDate()
    dataAlta?: Date;
}