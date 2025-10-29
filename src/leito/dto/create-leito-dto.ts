/* eslint-disable prettier/prettier */
import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class CreateLeitoDto {
    @IsString()
    @IsNotEmpty()
    ala: string;
    
    @IsNotEmpty()
    @IsString()
    numeroLeito: string;

    @IsNotEmpty()
    @IsBoolean()
    ocupado: boolean;
}