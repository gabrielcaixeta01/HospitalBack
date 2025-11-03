/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/swagger';
import { CreateConsultaDto } from './create-consulta-dto';
import { IsInt, IsOptional, IsPositive, IsISO8601 } from 'class-validator';

export class UpdateConsultaDto extends PartialType(CreateConsultaDto) {
  @IsOptional()
  @IsISO8601({ strict: true })
  dataHora?: string;

  @IsOptional()
  @IsInt()
  @IsPositive()
  medicoId?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  pacienteId?: number;
}