import { IsArray, ArrayNotEmpty, IsInt, Min } from 'class-validator';

export class LinkMedicoEspecialidadeDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  @Min(1, { each: true })
  especialidadeIds!: number[];
}
