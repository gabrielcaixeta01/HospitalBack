import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateConsultaDto } from './dto/create-consulta-dto';
import { UpdateConsultaDto } from './dto/update-consulta-dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ConsultasService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateConsultaDto) {
    if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/.test(data.dataHora)) {
      throw new BadRequestException('Envie dataHora em ISO UTC, ex: 2025-11-03T13:30:00Z');
    }

    try {
      return await this.prisma.consulta.create({
        data: {
          dataHora: new Date(data.dataHora),
          motivo: data.motivo,
          notas: data.notas,
          medicoId: Number(data.medicoId),
          pacienteId: Number(data.pacienteId),
        },
        include: {
          medico: { select: { id: true, nome: true } },
          paciente: { select: { id: true, nome: true } },
        },
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2003') {
        throw new BadRequestException('medicoId ou pacienteId inválidos.');
      }
      throw err;
    }
  }

  async findAll() {
    return this.prisma.consulta.findMany({
      orderBy: { dataHora: 'desc' },
      include: {
        medico: { select: { id: true, nome: true } },
        paciente: { select: { id: true, nome: true } },
      },
    });
  }

  async findOne(id: number) {
    const consulta = await this.prisma.consulta.findUnique({
      where: { id: Number(id) },
      include: {
        medico: { select: { id: true, nome: true } },
        paciente: { select: { id: true, nome: true } },
      },
    });
    if (!consulta) throw new NotFoundException(`Consulta ${id} não encontrada.`);
    return consulta;
  }

  async update(id: number, data: UpdateConsultaDto) {
    const updateData: Prisma.ConsultaUpdateInput = {};
    if (data.dataHora) {
      if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/.test(data.dataHora)) {
        throw new BadRequestException('dataHora deve ser ISO UTC (ex.: ...Z)');
      }
      updateData.dataHora = new Date(data.dataHora);
    }
    if (data.motivo !== undefined) updateData.motivo = data.motivo;
    if (data.notas !== undefined) updateData.notas = data.notas;
    if (data.medicoId !== undefined) updateData.medico = { connect: { id: Number(data.medicoId) } };
    if (data.pacienteId !== undefined) updateData.paciente = { connect: { id: Number(data.pacienteId) } };

    try {
      return await this.prisma.consulta.update({
        where: { id: Number(id) },
        data: updateData,
        include: {
          medico: { select: { id: true, nome: true } },
          paciente: { select: { id: true, nome: true } },
        },
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
        throw new NotFoundException(`Consulta ${id} não encontrada.`);
      }
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2003') {
        throw new BadRequestException('medicoId ou pacienteId inválidos.');
      }
      throw err;
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.consulta.delete({ where: { id: Number(id) } });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
        throw new NotFoundException(`Consulta ${id} não encontrada.`);
      }
      throw err;
    }
  }
}