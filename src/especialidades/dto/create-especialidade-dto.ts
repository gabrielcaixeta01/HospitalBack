import { IsNotEmpty } from 'class-validator';

export class CreateEspecialidadeDto {
  @IsNotEmpty()
  nome!: string;
}
