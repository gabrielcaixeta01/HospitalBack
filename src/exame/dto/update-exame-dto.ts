/* eslint-disable prettier/prettier */
import { IsInt, IsOptional, IsString, IsISO8601 } from 'class-validator';

export class UpdateExameDto {
  @IsOptional()
  @IsInt()
  consultaId?: number;

  @IsOptional()
  @IsString()
  tipo?: string;

  @IsOptional()
  @IsString()
  resultado?: string | null; // null para “pendente”

  @IsOptional()
  @IsISO8601()
  dataHora?: string | null;
}