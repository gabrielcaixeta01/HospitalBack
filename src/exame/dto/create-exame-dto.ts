/* eslint-disable prettier/prettier */
import { IsInt, IsNotEmpty, IsOptional, IsString, IsISO8601 } from 'class-validator';

export class CreateExameDto {
  @IsInt()
  consultaId: number;

  @IsString()
  @IsNotEmpty()
  tipo: string;

  // resultado opcional (pendente se ausente)
  @IsOptional()
  @IsString()
  resultado?: string;

  // ISO 8601 (ex.: 2025-11-03T15:30:00-03:00). Opcional.
  @IsOptional()
  @IsISO8601()
  dataHora?: string;
}
