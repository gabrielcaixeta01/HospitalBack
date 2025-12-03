import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateConsultaDto } from './dto/create-consulta-dto';
import { UpdateConsultaDto } from './dto/update-consulta-dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class ConsultasService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly ISO_UTC_REGEX =
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/;

  async create(data: CreateConsultaDto) {
    if (!this.ISO_UTC_REGEX.test(data.dataHora)) {
      throw new BadRequestException(
        'Envie dataHora em ISO UTC, ex: 2025-11-03T13:30:00Z',
      );
    }

    try {
      return await this.prisma.consulta.create({
        data: {
          dataHora: new Date(data.dataHora),
          motivo: data.motivo,
          notas: data.notas,
          medicoId: Number(data.medicoId),
          pacienteId: Number(data.pacienteId),
          especialidadeId: Number(data.especialidadeId),
        },
        include: {
          medico: { select: { id: true, nome: true } },
          paciente: { select: { id: true, nome: true } },
        },
      });
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError && (err as any).code === 'P2003') {
        throw new BadRequestException('medicoId, pacienteId ou especialidadeId inválidos.');
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
    const updateData: any = {};
    if (data.dataHora) {
      if (!this.ISO_UTC_REGEX.test(data.dataHora)) {
        throw new BadRequestException('dataHora deve ser ISO UTC (ex.: ...Z)');
      }
      updateData.dataHora = new Date(data.dataHora);
    }
    if (data.motivo !== undefined) updateData.motivo = data.motivo;
    if (data.notas !== undefined) updateData.notas = data.notas;
    if (data.medicoId !== undefined)
      updateData.medico = { connect: { id: Number(data.medicoId) } };
    if (data.pacienteId !== undefined)
      updateData.paciente = { connect: { id: Number(data.pacienteId) } };

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
      if (err instanceof PrismaClientKnownRequestError && (err as any).code === 'P2025') {
        throw new NotFoundException(`Consulta ${id} não encontrada.`);
      }
      if (err instanceof PrismaClientKnownRequestError && (err as any).code === 'P2003') {
        throw new BadRequestException('medicoId ou pacienteId inválidos.');
      }
      throw err;
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.consulta.delete({ where: { id: Number(id) } });
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError && (err as any).code === 'P2025') {
        throw new NotFoundException(`Consulta ${id} não encontrada.`);
      }
      throw err;
    }
  }

  // procedure para registrar consulta verificada
  async registrarConsultaVerificada(data: {
    pacienteId: number;
    medicoId: number;
    dataHora: string;
    motivo: string;
    especialidadeNome: string;
  }) {
    if (!this.ISO_UTC_REGEX.test(data.dataHora)) {
      throw new BadRequestException(
        'Envie dataHora em ISO UTC, ex: 2025-11-03T13:30:00Z',
      );
    }

    try {
      const result =
        await this.prisma.$queryRawUnsafe<
          { registrar_consulta_verificada: bigint }[]
        >(
          `
          SELECT Registrar_Consulta_Verificada(
            $1::BIGINT,
            $2::BIGINT,
            $3::TIMESTAMP,
            $4::VARCHAR,
            $5::VARCHAR
          ) as registrar_consulta_verificada
        `,
          data.pacienteId,
          data.medicoId,
          data.dataHora,
          data.motivo,
          data.especialidadeNome,
        );

      if (!result || result.length === 0) {
        throw new BadRequestException(
          'A procedure não retornou um ID de consulta.',
        );
      }

      const consultaId = Number(result[0].registrar_consulta_verificada);

      const consulta = await this.prisma.consulta.findUnique({
        where: { id: consultaId },
        include: {
          medico: { select: { id: true, nome: true } },
          paciente: { select: { id: true, nome: true } },
        },
      });

      return {
        consultaId,
        consulta,
      };
    } catch (err: any) {
      if (err instanceof PrismaClientKnownRequestError && (err as any).code === 'P2010') {
        const msg = (err as any).meta?.message as string | undefined;
        if (msg?.includes('Especialidade') || msg?.includes('Médico')) {
          throw new BadRequestException(msg);
        }
      }
      throw err;
    }
  }
}