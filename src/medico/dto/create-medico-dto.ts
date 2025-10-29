import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateMedicoDto {
  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsString()
  @IsNotEmpty()
  crm: string;

  @IsString()
  @IsOptional()
  telefone?: string;

  @IsEmail()
  @IsOptional()
  email?: string;
}
