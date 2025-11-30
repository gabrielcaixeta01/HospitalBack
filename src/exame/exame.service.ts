import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateExameDto } from './dto/create-exame-dto';
import { UpdateExameDto } from './dto/update-exame-dto';

@Injectable()
export class ExameService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateExameDto) {
    const consulta = await this.prisma.consulta.findUnique({
      where: { id: Number(data.consultaId) },
      select: { id: true },
    });
    if (!consulta) {
      throw new BadRequestException('Consulta inexistente para consultaId informado.');
    }

    return this.prisma.exame.create({
      data: {
        consultaId: Number(data.consultaId),
        tipo: data.tipo,
        resultado: data.resultado ?? null,
        dataHora: data.dataHora ? new Date(data.dataHora) : null,
      },
    });
  }

  async findAll() {
    return this.prisma.exame.findMany({
      orderBy: { id: 'asc' },
      include: {
        consulta: {
          select: {
            id: true,
            dataHora: true,
            motivo: true,
            paciente: { select: { id: true, nome: true } },
            medico:   { select: { id: true, nome: true } },
          },
        },
      },
    });
  }

  async findOne(id: number) {
    const exame = await this.prisma.exame.findUnique({
      where: { id },
      include: {
        consulta: {
          select: {
            id: true,
            dataHora: true,
            motivo: true,
            paciente: { select: { id: true, nome: true } },
            medico:   { select: { id: true, nome: true } },
          },
        },
      },
    });
    if (!exame) throw new NotFoundException(`Exame ${id} não encontrado.`);
    return exame;
  }

  async update(id: number, data: UpdateExameDto) {
    if (data.consultaId != null) {
      const exists = await this.prisma.consulta.findUnique({
        where: { id: Number(data.consultaId) },
        select: { id: true },
      });
      if (!exists) throw new BadRequestException('Nova consultaId não existe.');
    }

    return this.prisma.exame.update({
      where: { id },
      data: {
        ...(data.tipo !== undefined ? { tipo: data.tipo } : {}),
        ...(data.resultado !== undefined ? { resultado: data.resultado } : {}),
        ...(data.consultaId !== undefined ? { consultaId: Number(data.consultaId) } : {}),
        ...(data.dataHora !== undefined
          ? { dataHora: data.dataHora ? new Date(data.dataHora) : null }
          : {}),
      },
      include: {
        consulta: {
          select: {
            id: true,
            dataHora: true,
            motivo: true,
            paciente: { select: { id: true, nome: true } },
            medico:   { select: { id: true, nome: true } },
          },
        },
      },
    });
  }

  async remove(id: number) {
    const found = await this.prisma.exame.findUnique({ where: { id } });
    if (!found) throw new NotFoundException(`Exame ${id} não encontrado.`);

    await this.prisma.exame.delete({ where: { id } });
    return { ok: true };
  }

  async countPendentes() {
    const qtd = await this.prisma.exame.count({ where: { resultado: null } });
    return { pendentes: qtd };
  }
}
