/* eslint-disable prettier/prettier */
import { IsDate, IsOptional, IsString, IsInt } from 'class-validator';

export class UpdateArquivoDto {
    @IsOptional()
    @IsInt()
    pacienteId?: number;

    @IsOptional()
    @IsString()
    nomeArquivo?: string;

    @IsOptional()
    @IsString()
    mimeType?: string;

    // base64 or url
    @IsOptional()
    conteudo?: string;

    @IsOptional()
    @IsDate()
    criadoEm?: Date;
}