import { IsString, IsInt, IsPositive } from 'class-validator';

export class RegistrarConsultaVerificadaDto {
  @IsInt()
  @IsPositive()
  pacienteId!: number;

  @IsInt()
  @IsPositive()
  medicoId!: number;

  @IsString()
  dataHora!: string;

  @IsString()
  motivo!: string;

  @IsString()
  especialidadeNome!: string;
}