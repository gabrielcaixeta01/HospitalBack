/* eslint-disable prettier/prettier */
import { IsIn, IsOptional, IsString } from 'class-validator';

export class UpdateLeitoDto {
  @IsString()
  @IsOptional()
  codigo?: string;

  @IsString()
  @IsOptional()
  @IsIn(['livre', 'ocupado', 'manutencao'])
  status?: 'livre' | 'ocupado' | 'manutencao';
}