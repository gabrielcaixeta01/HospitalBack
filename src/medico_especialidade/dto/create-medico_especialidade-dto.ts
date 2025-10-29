/* eslint-disable prettier/prettier */
import { IsNotEmpty } from "class-validator";

export class CreateMedicoEspecialidadeDto {
    @IsNotEmpty()
    medicoId: bigint;

    @IsNotEmpty()
    especialidadeId: bigint;
}