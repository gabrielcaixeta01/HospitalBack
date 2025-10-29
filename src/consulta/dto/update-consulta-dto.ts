/* eslint-disable prettier/prettier */
import { IsDate, IsOptional, IsInt } from "class-validator";


export class UpdateConsultaDto {
    @IsOptional()
    @IsInt()
    pacienteId?: bigint;

    @IsOptional()
    @IsInt()
    medicoId?: bigint;

    @IsOptional()
    @IsDate()
    dataHora?: Date;

    @IsOptional()
    status?: string;

    @IsOptional()
    motivo?: string;
}
