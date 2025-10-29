/* eslint-disable prettier/prettier */
import { IsDate, IsOptional } from "class-validator";


export class UpdateConsultaDto {
    @IsOptional()
    pacienteId?: bigint;

    @IsOptional()
    medicoId?: bigint;

    @IsOptional()
    @IsDate()
    dataConsulta?: Date;

    @IsOptional()
    status?: string;

    @IsOptional()
    motivo?: string;
}
