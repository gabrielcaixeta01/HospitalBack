/* eslint-disable prettier/prettier */
import { IsISO8601, IsInt, IsOptional, IsPositive, IsString, MaxLength } from 'class-validator';

export class CreateConsultaDto {
  @IsISO8601({ strict: true }, { message: 'dataHora deve ser ISO 8601' })
  dataHora!: string; // envie ISO ex.: 2025-11-03T13:30:00Z

  @IsOptional()
  @IsString()
  @MaxLength(255)
  motivo?: string;

  @IsOptional()
  @IsString()
  notas?: string;

  @IsInt()
  @IsPositive()
  medicoId!: number;

  @IsInt()
  @IsPositive()
  pacienteId!: number;
}