import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class ArquivoClinicoService {
  constructor(private readonly prisma: PrismaService) {}

  async upload(pacienteId: number, file: any) {
    if (!file) {
      throw new NotFoundException("Nenhum arquivo enviado.");
    }

    return this.prisma.arquivoClinico.create({
      data: {
        pacienteId: BigInt(pacienteId),
        nome_arquivo: file.originalname,
        mime_type: file.mimetype,
        conteudo: file.buffer as any, // Buffer (Multer) -> BYTEA
      },
    });
  }

  async listarPorPaciente(pacienteId: number) {
    return this.prisma.arquivoClinico.findMany({
      where: { pacienteId: BigInt(pacienteId) },
      orderBy: { criado_em: "desc" },
      select: {
        id: true,
        nome_arquivo: true,
        mime_type: true,
        criado_em: true,
      },
    });
  }

  async getArquivo(id: number) {
    const arq = await this.prisma.arquivoClinico.findUnique({
      where: { id: BigInt(id) },
    });

    if (!arq) {
      throw new NotFoundException("Arquivo não encontrado.");
    }

    return arq;
  }

  async remover(id: number) {
    await this.getArquivo(id);

    await this.prisma.arquivoClinico.delete({
      where: { id: BigInt(id) },
    });

    return { ok: true };
  }
}
