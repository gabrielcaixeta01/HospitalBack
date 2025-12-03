import { IsInt, IsOptional, IsString, IsPositive, IsNotEmpty } from 'class-validator';

export class UpdatePrescricaoDto {
  @IsOptional()
  @IsInt()
  @IsPositive()
  consultaId?: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  texto?: string;
}
