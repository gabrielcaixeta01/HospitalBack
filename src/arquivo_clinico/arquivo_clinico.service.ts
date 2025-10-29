import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateArquivoDto } from './dto/create-arquivo-dto';
import { UpdateArquivoDto } from './dto/update-arquivo-dto';

@Injectable()
export class ArquivoClinicoService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateArquivoDto) {
    const { pacienteId, nomeArquivo, mimeType, conteudo, criadoEm } = data;
    const record = await this.prisma.arquivoClinico.create({
      data: {
        pacienteId: pacienteId,
        titulo: nomeArquivo,
        tipo: mimeType,
        url: conteudo ?? '',
        criadoEm: criadoEm ?? new Date(),
      },
    });

    return record;
  }

  async findAll() {
    return await this.prisma.arquivoClinico.findMany();
  }

  async findOne(id: number) {
    const rec = await this.prisma.arquivoClinico.findUnique({ where: { id } });

    if (!rec) {
      throw new NotFoundException(`ArquivoClinico com ID ${id} não encontrado`);
    }

    return rec;
  }

  async update(id: number, data: UpdateArquivoDto) {
    // map fields into a simple partial payload matching model fields
    type UpdatePayload = Partial<{
      pacienteId: number;
      titulo: string;
      tipo: string;
      url: string;
      criadoEm: Date;
    }>;

    const payload: UpdatePayload = {};

    if (data.pacienteId != null) payload.pacienteId = data.pacienteId;
    if (data.nomeArquivo != null) payload.titulo = data.nomeArquivo;
    if (data.mimeType != null) payload.tipo = data.mimeType;
    if (data.conteudo != null) payload.url = data.conteudo;
    if (data.criadoEm != null) payload.criadoEm = data.criadoEm;

    const updated = await this.prisma.arquivoClinico.update({
      where: { id },
      data: payload,
    });

    return updated;
  }

  async remove(id: number) {
    await this.findOne(id); // throws if not exists

    return await this.prisma.arquivoClinico.delete({ where: { id } });
  }
}
