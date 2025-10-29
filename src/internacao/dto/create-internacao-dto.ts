/* eslint-disable prettier/prettier */
import { IsDate, IsNotEmpty, IsOptional } from "class-validator";


export class CreateInternacaoDto {
    @IsNotEmpty()
    pacienteId: bigint;

    @IsNotEmpty()
    leitoId: bigint;

    @IsNotEmpty()
    @IsDate()
    dataEntrada: Date;

    @IsOptional()
    @IsDate()
    dataAlta?: Date;
}