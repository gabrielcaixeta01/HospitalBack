/* eslint-disable prettier/prettier */
import { IsEmail, IsOptional, IsString, IsNotEmpty } from "class-validator";

export class CreatePacienteDto {
    @IsString()
    @IsNotEmpty()
    nome: string;

    @IsString()
    @IsNotEmpty()
    cpf: string;

    @IsString()
    @IsNotEmpty()
    dataNascimento: Date;

    @IsString()
    @IsNotEmpty()
    sexo: string;

    @IsString()
    @IsNotEmpty()
    telefone: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsOptional()
    observacoes?: string;
    

}