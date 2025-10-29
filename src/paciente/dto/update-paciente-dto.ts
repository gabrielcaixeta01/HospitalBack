/* eslint-disable prettier/prettier */
import { IsEmail, IsOptional, IsString } from "class-validator";

export class UpdatePacienteDto {
    @IsString()
    @IsOptional()
    nome?: string;

    @IsString()
    @IsOptional()
    cpf?: string;

    @IsString()
    @IsOptional()
    dataNascimento?: Date;

    @IsString()
    @IsOptional()
    sexo?: string;

    @IsString()
    @IsOptional()
    telefone?: string;

    @IsEmail()
    @IsOptional()
    email?: string;

    @IsString()
    @IsOptional()
    observacoes?: string;
    

}