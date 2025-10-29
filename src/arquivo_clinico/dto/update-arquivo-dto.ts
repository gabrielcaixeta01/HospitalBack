/* eslint-disable prettier/prettier */
import { IsDate, IsOptional, IsString, IsInt } from "class-validator";

export class UpdateArquivoDto {
    @IsOptional()
    @IsInt()
    pacienteId?: bigint;

    @IsOptional()
    @IsString()
    nomeArquivo?: string;

    @IsOptional()
    @IsString()
    mimeType?: string;

    conteudo?: Buffer;

    @IsOptional()
    @IsDate()
    criadoEm?: Date;
}