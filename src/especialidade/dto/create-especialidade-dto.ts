import { IsNotEmpty, IsString } from 'class-validator';

export class CreateEspecialidadeDto {
  @IsString()
  @IsNotEmpty()
  nome: string;
}
