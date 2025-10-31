/* eslint-disable prettier/prettier */
import { IsEmail, IsOptional, IsString, IsIn, IsDateString } from 'class-validator';

export class UpdatePacienteDto {
    @IsString()
    @IsOptional()
    nome?: string;

    @IsString()
    @IsOptional()
    cpf?: string;

    @IsDateString()
    @IsOptional()
    dataNascimento?: Date;

    @IsOptional()
    @IsIn(['M', 'F', 'O'])
    sexo?: 'M' | 'F' | 'O';

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