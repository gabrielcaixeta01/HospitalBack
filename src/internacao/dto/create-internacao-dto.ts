import { IsInt, IsOptional, IsISO8601, Min } from 'class-validator';

export class CreateInternacaoDto {
  @IsInt()
  @Min(1)
  pacienteId!: number;

  @IsInt()
  @Min(1)
  leitoId!: number;

  @IsISO8601({ strict: true }, { message: 'dataEntrada deve ser ISO 8601' })
  dataEntrada!: string;

  @IsOptional()
  @IsISO8601({ strict: true }, { message: 'dataAlta deve ser ISO 8601' })
  dataAlta?: string | null;
}