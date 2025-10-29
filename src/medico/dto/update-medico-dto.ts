import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateMedicoDto {
  @IsString()
  @IsNotEmpty()
  nome?: string;

  @IsString()
  @IsNotEmpty()
  crm?: string;

  @IsString()
  @IsOptional()
  telefone?: string;

  @IsEmail()
  @IsOptional()
  email?: string;
}
