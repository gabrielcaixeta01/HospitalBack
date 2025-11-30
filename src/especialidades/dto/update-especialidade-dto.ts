import { IsNotEmpty } from 'class-validator';

export class UpdateEspecialidadeDto {
  @IsNotEmpty()
  nome!: string;
}
