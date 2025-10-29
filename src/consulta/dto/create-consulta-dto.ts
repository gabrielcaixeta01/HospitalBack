/* eslint-disable prettier/prettier */
import { IsDate, IsNotEmpty, IsInt } from "class-validator";


export class CreateConsultaDto {
    @IsNotEmpty()
    @IsInt()
    pacienteId: bigint;

    @IsNotEmpty()
    @IsInt()
    medicoId: bigint;

    @IsNotEmpty()
    @IsDate()
    dataConsulta: Date;

    @IsNotEmpty()
    status: string;

    @IsNotEmpty()
    motivo: string;
}
