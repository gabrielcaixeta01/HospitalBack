import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateExameDto } from './dto/create-exame-dto';
import { UpdateExameDto } from './dto/update-exame-dto';

@Injectable()
export class ExamesService {
  constructor(private readonly prisma: PrismaService) {}

  // Cria um exame
  async create(data: CreateExameDto) {
    const { consultaId, tipo, resultado } = data;

    return await this.prisma.exame.create({
      data: {
        consultaId,
        tipo,
        resultado,
      },
    });
  }

  // Retorna todos os exames
  async findAll() {
    return await this.prisma.exame.findMany({
      include: {
        consulta: true,
      },
    });
  }

  async findExame(id: number) {
    const exame = await this.prisma.exame.findUnique({
      where: { id },
      include: {
        consulta: true,
      },
    });

    if (!exame) {
      throw new NotFoundException(`Exame com ID ${id} não encontrado.`);
    }

    return exame;
  }

  async deleteExame(id: number) {
    const exame = await this.prisma.exame.findUnique({
      where: { id },
    });

    if (!exame) {
      throw new NotFoundException(`Exame com ID ${id} não encontrado.`);
    }

    return await this.prisma.exame.delete({
      where: {
        id,
      },
    });
  }

  // Atualiza um exame
  async updateExame(id: number, data: UpdateExameDto) {
    const { ...updateData } = data;

    return await this.prisma.exame.update({
      where: {
        id,
      },
      data: {
        ...updateData,
      },
    });
  }
}
