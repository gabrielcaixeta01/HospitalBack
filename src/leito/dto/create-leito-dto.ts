/* eslint-disable prettier/prettier */
import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateLeitoDto {
  @IsString()
  @IsNotEmpty()
  codigo!: string; // ex.: "A-201"

  @IsString()
  @IsOptional()
  @IsIn(['livre', 'ocupado', 'manutencao'])
  status?: 'livre' | 'ocupado' | 'manutencao';
}