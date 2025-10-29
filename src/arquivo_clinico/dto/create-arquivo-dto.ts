/* eslint-disable prettier/prettier */
import { IsDate, IsNotEmpty, IsString, IsInt, IsOptional } from 'class-validator';

export class CreateArquivoDto {
    @IsNotEmpty()
    @IsInt()
    pacienteId: number;

    @IsNotEmpty()
    @IsString()
    nomeArquivo: string;

    @IsNotEmpty()
    @IsString()
    mimeType: string;

    // base64 content or url — optional, service will accept and store as url/base64
    @IsOptional()
    conteudo?: string;

    @IsOptional()
    @IsDate()
    criadoEm?: Date;
}