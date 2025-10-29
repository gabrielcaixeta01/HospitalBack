/* eslint-disable prettier/prettier */
import { IsDate, IsNotEmpty, IsInt } from "class-validator";


export class CreateConsultaDto {
    @IsNotEmpty()
    @IsInt()
    pacienteId: number;

    @IsNotEmpty()
    @IsInt()
    medicoId: number;

    @IsNotEmpty()
    @IsDate()
    dataHora: Date;

    @IsNotEmpty()
    motivo: string;
}
