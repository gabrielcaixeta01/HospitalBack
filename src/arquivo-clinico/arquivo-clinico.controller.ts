import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  UploadedFile,
  UseInterceptors,
  Res,
} from "@nestjs/common";
import { ArquivoClinicoService } from "./arquivo-clinico.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { Response } from "express";

@Controller("arquivo-clinico")
export class ArquivoClinicoController {
  constructor(private readonly service: ArquivoClinicoService) {}

  @Post("upload/:pacienteId")
  @UseInterceptors(FileInterceptor("file"))
  upload(@Param("pacienteId") pacienteId: string, @UploadedFile() file: any) {
    return this.service.upload(Number(pacienteId), file);
  }

  @Get("paciente/:pacienteId")
  listar(@Param("pacienteId") pacienteId: string) {
    return this.service.listarPorPaciente(Number(pacienteId));
  }

  @Get(":id/download")
  async download(@Param("id") id: string, @Res() res: Response) {
    const arquivo = await this.service.getArquivo(Number(id));

    res.setHeader("Content-Type", arquivo.mime_type);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${arquivo.nome_arquivo}"`
    );

    return res.send(arquivo.conteudo);
  }

  @Delete(":id")
  remover(@Param("id") id: string) {
    return this.service.remover(Number(id));
  }
}
