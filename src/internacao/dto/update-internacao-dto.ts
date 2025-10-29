/* eslint-disable prettier/prettier */
import { IsDate, IsOptional } from "class-validator";


export class UpdateInternacaoDto {
    @IsOptional()
    pacienteId?: bigint;

    @IsOptional()
    leitoId?: bigint;

    @IsOptional()
    @IsDate()
    dataEntrada?: Date;

    @IsOptional()
    @IsDate()
    dataAlta?: Date;
}