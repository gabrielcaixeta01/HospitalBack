import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LeitoService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.leito.findMany({
      include: {
        internacao: {
          where: { dataAlta: null },
          include: { paciente: true },
        },
      },
      orderBy: { id: 'asc' },
    });
  }

  async findOne(id: number) {
    return this.prisma.leito.findUnique({
      where: { id },
      include: {
        internacao: {
          where: { dataAlta: null },
          include: { paciente: true },
        },
      },
    });
  }

  async create(data: { codigo: string }) {
    return this.prisma.leito.create({
      data: {
        codigo: data.codigo,
        status: 'livre',
      },
    });
  }

  async update(id: number, data: Partial<{ codigo: string; status: string }>) {
    return this.prisma.leito.update({
      where: { id },
      data,
    });
  }

  async updateStatus(id: number, status: 'livre' | 'ocupado' | 'manutencao') {
    return this.prisma.leito.update({
      where: { id },
      data: { status },
    });
  }

  async remove(id: number) {
    return this.prisma.leito.delete({
      where: { id },
    });
  }
}
