import { IsString, IsNotEmpty } from 'class-validator';

export class CreatePrescricaoForConsultaDto {
  @IsString()
  @IsNotEmpty()
  texto!: string;
}
