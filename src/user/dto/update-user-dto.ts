import { IsString, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  nome?: string;

  @IsString()
  @IsOptional()
  senha?: string;

  // Base64 string (optional)
  @IsOptional()
  @IsString()
  profilepic?: string | Buffer;
}
