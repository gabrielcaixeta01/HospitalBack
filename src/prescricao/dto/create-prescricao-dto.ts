import { IsInt, IsNotEmpty, IsString, IsPositive } from 'class-validator';

export class CreatePrescricaoDto {
  @IsInt()
  @IsPositive()
  consultaId!: number;

  @IsString()
  @IsNotEmpty()
  texto!: string;
}
