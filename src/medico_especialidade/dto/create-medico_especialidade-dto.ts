/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsInt } from "class-validator";

export class CreateMedicoEspecialidadeDto {
    @IsNotEmpty()
    @IsInt()
    medicoId: bigint;

    @IsNotEmpty()
    @IsInt()
    especialidadeId: bigint;
}