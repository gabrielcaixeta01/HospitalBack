import { IsInt, IsNotEmpty, IsOptional, IsString, IsISO8601 } from 'class-validator';

export class CreateExameDto {
  @IsInt()
  consultaId!: number;

  @IsString()
  @IsNotEmpty()
  tipo!: string;

  @IsOptional()
  @IsString()
  resultado?: string;

  @IsOptional()
  @IsISO8601()
  dataHora?: string;
}
