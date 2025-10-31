/* eslint-disable prettier/prettier */
import { IsInt, IsOptional } from "class-validator";

export class UpdateMedicoEspecialidadeDto {
    @IsOptional()
    @IsInt()
    medicoId?: bigint;

    @IsOptional()
    @IsInt()
    especialidadeId?: bigint;
}