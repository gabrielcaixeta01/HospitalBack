/* eslint-disable prettier/prettier */
import { IsOptional } from "class-validator";

export class UpdateMedicoEspecialidadeDto {
    @IsOptional()
    medicoId?: bigint;

    @IsOptional()
    especialidadeId?: bigint;
}