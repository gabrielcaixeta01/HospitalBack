/* eslint-disable prettier/prettier */
import { IsDate, IsNotEmpty, IsString, IsInt } from "class-validator";

export class CreateArquivoDto {
    @IsNotEmpty()
    @IsInt()
    pacienteId: bigint;

    @IsNotEmpty()
    @IsString()
    nomeArquivo: string;

    @IsNotEmpty()
    @IsString()
    mimeType: string;

    conteudo: Buffer;

    @IsNotEmpty()
    @IsDate()
    criadoEm: Date;
}