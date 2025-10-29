/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString, IsInt } from 'class-validator';

export class CreateExameDto {
    @IsNotEmpty()
    @IsInt()
    consultaId: bigint;

    @IsString()
    @IsNotEmpty()
    tipo: string;

    @IsString()
    @IsNotEmpty()
    resultado: string;
}
