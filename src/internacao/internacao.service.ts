import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateInternacaoDto } from './dto/create-internacao-dto';
import { UpdateInternacaoDto } from './dto/update-internacao-dto';

@Injectable()
export class InternacoesService {
  constructor(private readonly prisma: PrismaService) {}

  // Cria uma internação
  async create(data: CreateInternacaoDto) {
    const { pacienteId, leitoId, dataEntrada, dataAlta } = data;

    return await this.prisma.internacao.create({
      data: {
        pacienteId,
        leitoId,
        dataEntrada,
        dataAlta,
      },
    });
  }

  // Retorna todas as internações
  async findAll() {
    return await this.prisma.internacao.findMany({
      include: {
        paciente: true,
        leito: true,
      },
    });
  }

  async findInternacao(id: number) {
    const internacao = await this.prisma.internacao.findUnique({
      where: { id },
      include: {
        paciente: true,
        leito: true,
      },
    });

    if (!internacao) {
      throw new NotFoundException(`Internação com ID ${id} não encontrada.`);
    }

    return internacao;
  }

  async deleteInternacao(id: number) {
    const internacao = await this.prisma.internacao.findUnique({
      where: { id },
    });

    if (!internacao) {
      throw new NotFoundException(`Internação com ID ${id} não encontrada.`);
    }

    return await this.prisma.internacao.delete({
      where: {
        id,
      },
    });
  }

  // Atualiza uma internação
  async updateInternacao(id: number, data: UpdateInternacaoDto) {
    const { ...updateData } = data;

    return await this.prisma.internacao.update({
      where: {
        id,
      },
      data: {
        ...updateData,
      },
    });
  }
}
