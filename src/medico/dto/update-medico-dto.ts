/* eslint-disable prettier/prettier */
import { IsEmail, IsOptional, IsString, IsArray, IsInt } from 'class-validator';

export class UpdateMedicoDto {
  @IsOptional() @IsString() nome?: string;
  @IsOptional() @IsString() crm?: string;
  @IsOptional() @IsString() telefone?: string;
  @IsOptional() @IsEmail() email?: string;

  // Mutação incremental
  @IsOptional() @IsArray() @IsInt({ each: true })
  especialidadeIdsToConnect?: number[];

  @IsOptional() @IsArray() @IsInt({ each: true })
  especialidadeIdsToDisconnect?: number[];

  // Substituição completa (set)
  @IsOptional() @IsArray() @IsInt({ each: true })
  replaceEspecialidadeIds?: number[];
}
