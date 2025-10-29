import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  Matches,
  IsOptional,
} from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'O nome deve ser uma string.' })
  @IsNotEmpty({ message: 'O nome é obrigatório.' })
  nome: string;

  @IsEmail({}, { message: 'O e-mail deve ser válido.' })
  @IsNotEmpty({ message: 'O e-mail é obrigatório.' })
  email: string;

  @IsString({ message: 'A senha deve ser uma string.' })
  @MinLength(8, { message: 'A senha deve ter pelo menos 8 caracteres.' })
  @Matches(/(?=.*[a-z])/, {
    message: 'A senha deve conter pelo menos uma letra minúscula.',
  })
  @Matches(/(?=.*[A-Z])/, {
    message: 'A senha deve conter pelo menos uma letra maiúscula.',
  })
  @Matches(/(?=.*\d)/, { message: 'A senha deve conter pelo menos um número.' })
  @Matches(/(?=.*[@$!%*?&])/, {
    message: 'A senha deve conter pelo menos um caractere especial.',
  })
  senha: string;

  // Base64 string (optional) - controller accepts base64 and converts to Buffer
  @IsOptional()
  @IsString()
  profilepic?: string | Buffer;
}
