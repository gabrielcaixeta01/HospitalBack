/* eslint-disable prettier/prettier */
import { IsDate, IsNotEmpty } from "class-validator";


export class CreateConsultaDto {
    @IsNotEmpty()
    pacienteId: bigint;

    @IsNotEmpty()
    medicoId: bigint;

    @IsNotEmpty()
    @IsDate()
    dataConsulta: Date;

    @IsNotEmpty()
    status: string;

    @IsNotEmpty()
    motivo: string;
}
