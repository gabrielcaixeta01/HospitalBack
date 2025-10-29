import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateConsultaDto } from './dto/create-consulta-dto';
import { UpdateConsultaDto } from './dto/update-consulta-dto';

@Injectable()
export class ConsultasService {
  constructor(private readonly prisma: PrismaService) {}

  // Cria uma consulta
  async create(data: CreateConsultaDto) {
    const { pacienteId, medicoId, dataHora, status, motivo } = data;

    return await this.prisma.consulta.create({
      data: {
        pacienteId,
        medicoId,
        dataHora,
        status,
        motivo,
      },
    });
  }

  async createConsulta(data: CreateConsultaDto) {
    const { pacienteId, medicoId, dataConsulta, status, motivo } = data;

    return await this.prisma.consulta.create({
      data: {
        pacienteId,
        medicoId,
        dataConsulta,
        status,
        motivo,
      },
    });
  }

  // Retorna todas as consultas
  async findAll() {
    return await this.prisma.consulta.findMany({});
  }

  async findConsulta(id: number) {
    const consulta = await this.prisma.consulta.findUnique({
      where: { id },
    });

    if (!consulta) {
      throw new NotFoundException(`Consulta com ID ${id} não encontrada.`);
    }

    return consulta;
  }

  async deleteConsulta(id: number) {
    const consulta = await this.prisma.consulta.findUnique({
      where: { id },
    });

    if (!consulta) {
      throw new NotFoundException(`Consulta com ID ${id} não encontrada.`);
    }

    return await this.prisma.consulta.delete({
      where: {
        id,
      },
    });
  }

  // Atualiza uma consulta
  async updateConsulta(id: number, data: UpdateConsultaDto) {
    const { ...updateData } = data;

    return await this.prisma.consulta.update({
      where: {
        id,
      },
      data: {
        ...updateData,
      },
    });
  }
}
