import { IsInt, IsOptional, IsISO8601, Min } from 'class-validator';

export class UpdateInternacaoDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  pacienteId?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  leitoId?: number;

  @IsOptional()
  @IsISO8601({ strict: true })
  dataEntrada?: string;

  @IsOptional()
  @IsISO8601({ strict: true })
  dataAlta?: string | null;
}