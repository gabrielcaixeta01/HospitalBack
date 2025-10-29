import { IsOptional, IsString } from 'class-validator';

export class UpdateEspecialidadeDto {
  @IsString()
  @IsOptional()
  nome?: string;
}
