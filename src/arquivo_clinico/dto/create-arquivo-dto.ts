/* eslint-disable prettier/prettier */
import { IsDate, IsNotEmpty, IsString } from "class-validator";

export class CreateArquivoDto {
    @IsNotEmpty()
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