/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import type { Prisma } from '@prisma/client';
import { CreateInternacaoDto } from './dto/create-internacao-dto';
import { UpdateInternacaoDto } from './dto/update-internacao-dto';

function toDateOrNull(iso?: string | null) {
  if (iso == null || iso === '') return null;
  const d = new Date(iso);
  if (isNaN(d.getTime())) throw new BadRequestException('Data inválida: ' + iso);
  return d;
}

@Injectable()
export class InternacoesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateInternacaoDto) {
    const { pacienteId, leitoId, dataEntrada, dataAlta } = data;

    return this.prisma.internacao.create({
      data: {
        pacienteId,
        leitoId,
        dataEntrada: toDateOrNull(dataEntrada)!, // obrigatório
        dataAlta: toDateOrNull(dataAlta ?? null),
      },
      include: {
        paciente: { select: { id: true, nome: true } },
        leito: { select: { id: true, codigo: true } },
      },
    });
  }

  async findAll() {
    return this.prisma.internacao.findMany({
      orderBy: { id: 'asc' },
      include: {
        paciente: { select: { id: true, nome: true } },
        leito: { select: { id: true, codigo: true } },
      },
    });
  }

  async findOne(id: number) {
    const item = await this.prisma.internacao.findUnique({
      where: { id },
      include: {
        paciente: { select: { id: true, nome: true } },
        leito: { select: { id: true, codigo: true } },
      },
    });
    if (!item) throw new NotFoundException(`Internação ${id} não encontrada.`);
    return item;
  }

  async update(id: number, data: UpdateInternacaoDto) {
    await this.ensureExists(id);
    const payload: Prisma.InternacaoUpdateInput = {};
    if (data.pacienteId != null) payload.paciente = { connect: { id: data.pacienteId } };
    if (data.leitoId != null) payload.leito = { connect: { id: data.leitoId } };
    if (data.dataEntrada !== undefined) {
      const d = toDateOrNull(data.dataEntrada ?? null);
      if (d === null) throw new BadRequestException('dataEntrada não pode ser nula.');
      payload.dataEntrada = d;
    }
    if (data.dataAlta !== undefined) payload.dataAlta = toDateOrNull(data.dataAlta ?? null);
    return this.prisma.internacao.update({
      where: { id },
      data: payload,
      include: {
        paciente: { select: { id: true, nome: true } },
        leito: { select: { id: true, codigo: true } },
      },
    });
  }

  async remove(id: number) {
    // garante 404 claro
    await this.ensureExists(id);
    return this.prisma.internacao.delete({ where: { id } });
  }

  private async ensureExists(id: number) {
    const found = await this.prisma.internacao.findUnique({ where: { id } });
    if (!found) throw new NotFoundException(`Internação ${id} não encontrada.`);
  }
}
