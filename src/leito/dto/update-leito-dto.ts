/* eslint-disable prettier/prettier */
import { IsIn, IsOptional, IsString } from 'class-validator';

export class UpdateLeitoDto {
  @IsString()
  @IsOptional()
  codigo?: string;

  @IsString()
  @IsOptional()
  @IsIn(['livre', 'manutencao'], {
    message: 'status só pode ser "livre" ou "manutencao". Status "ocupado" é controlado por internações.',
  })
  status?: 'livre' | 'manutencao';
}