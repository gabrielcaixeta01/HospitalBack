import { IsNotEmpty, IsString } from 'class-validator';

export class CreateLeitoDto {
  @IsString()
  @IsNotEmpty()
  codigo!: string;
}
