/* eslint-disable prettier/prettier */
import { IsDate, IsNotEmpty, IsOptional, IsInt } from "class-validator";


export class CreateInternacaoDto {
    @IsNotEmpty()
    @IsInt()
    pacienteId: bigint;

    @IsNotEmpty()
    @IsInt()
    leitoId: bigint;

    @IsNotEmpty()
    @IsDate()
    dataEntrada: Date;

    @IsOptional()
    @IsDate()
    dataAlta?: Date;
}