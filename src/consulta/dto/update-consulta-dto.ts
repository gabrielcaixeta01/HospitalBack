import { IsInt, IsOptional, IsPositive, IsISO8601, IsString } from 'class-validator';

export class UpdateConsultaDto {

  @IsOptional()
  @IsISO8601({ strict: true })
  dataHora?: string;

  @IsOptional()
  @IsString()
  motivo?: string;

  @IsOptional()
  @IsString()
  notas?: string;

  @IsOptional()
  @IsInt()
  @IsPositive()
  medicoId?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  pacienteId?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  especialidadeId?: number;
}