/* eslint-disable prettier/prettier */
import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class CreatePrescricaoDto {
    @IsNotEmpty()
    @IsInt()
    consultaId: bigint;

    @IsString()
    @IsNotEmpty()
    texto: string;
}