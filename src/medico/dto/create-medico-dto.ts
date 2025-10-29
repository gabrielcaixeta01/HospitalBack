import { IsEmail, IsOptional, IsString, IsArray, IsInt } from 'class-validator';

export class CreateMedicoDto {
  @IsString() nome: string;
  @IsString() crm: string;
  @IsOptional() @IsString() telefone?: string;
  @IsEmail() email: string;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  especialidadeIds?: number[];
}
