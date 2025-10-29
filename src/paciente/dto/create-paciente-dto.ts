/* eslint-disable prettier/prettier */
import { IsEmail, IsOptional, IsString, IsNotEmpty, IsDate, IsIn } from 'class-validator';

export class CreatePacienteDto {
    @IsString()
    @IsNotEmpty()
    nome: string;

    @IsString()
    @IsNotEmpty()
    cpf: string;

    @IsDate()
    @IsNotEmpty()
    dataNascimento: Date;

    @IsOptional()
    @IsIn(['M', 'F', 'O'])
    sexo?: 'M' | 'F' | 'O';

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