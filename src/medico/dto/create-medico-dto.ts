import { IsEmail, IsOptional, IsString, IsArray, IsInt } from 'class-validator';

export class CreateMedicoDto {
  @IsString()
  nome!: string;

  @IsOptional()
  @IsString()
  crm?: string;

  @IsOptional()
  @IsString()
  telefone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  especialidadesIds?: number[];
}