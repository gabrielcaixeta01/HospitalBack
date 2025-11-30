/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InternacoesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.internacao.findMany({
      include: {
        paciente: true,
        leito: true,
      },
      orderBy: { id: 'asc' },
    });
  }

  async create(data: {
    pacienteId: bigint | number;
    leitoId: bigint | number;
    dataEntrada: Date;
  }) {
    const pacienteJaInternado = await this.prisma.internacao.findFirst({
      where: { pacienteId: BigInt(data.pacienteId), dataAlta: null },
    });

    if (pacienteJaInternado) {
      throw new BadRequestException(
        'O paciente já possui uma internação ativa.',
      );
    }

    const leito = await this.prisma.leito.findUnique({
      where: { id: BigInt(data.leitoId) },
    });

    if (!leito) {
      throw new NotFoundException('Leito não encontrado.');
    }

    if (leito.status === 'ocupado') {
      throw new BadRequestException('Este leito já está ocupado.');
    }

    if (leito.status === 'manutencao') {
      throw new BadRequestException('Este leito está em manutenção.');
    }

    const internacao = await this.prisma.internacao.create({
      data: {
        pacienteId: BigInt(data.pacienteId),
        leitoId: BigInt(data.leitoId),
        dataEntrada: new Date(data.dataEntrada),
      },
      include: {
        paciente: true,
        leito: true,
      },
    });

    await this.prisma.leito.update({
      where: { id: BigInt(data.leitoId) },
      data: { status: 'ocupado' },
    });

    return internacao;
  }

  async findOne(id: number | bigint) {
    const internacao = await this.prisma.internacao.findUnique({
      where: { id: BigInt(id) },
      include: {
        paciente: true,
        leito: true,
      },
    });

    if (!internacao) {
      throw new NotFoundException('Internação não encontrada.');
    }

    return internacao;
  }

  async update(
    id: number | bigint,
    data: {
      pacienteId?: number;
      leitoId?: number;
      dataEntrada?: string;
      dataAlta?: string | null;
    },
  ) {
    const internacao = await this.prisma.internacao.findUnique({
      where: { id: BigInt(id) },
    });

    if (!internacao) {
      throw new NotFoundException('Internação não encontrada.');
    }

    if (data.leitoId && BigInt(data.leitoId) !== internacao.leitoId) {
      const novoLeito = await this.prisma.leito.findUnique({
        where: { id: BigInt(data.leitoId) },
      });

      if (!novoLeito) {
        throw new NotFoundException('Leito não encontrado.');
      }

      if (novoLeito.status === 'ocupado') {
        throw new BadRequestException('Este leito já está ocupado.');
      }

      if (novoLeito.status === 'manutencao') {
        throw new BadRequestException('Este leito está em manutenção.');
      }

      if (internacao.dataAlta === null) {
        await this.prisma.leito.update({
          where: { id: internacao.leitoId },
          data: { status: 'livre' },
        });
      }

      await this.prisma.leito.update({
        where: { id: BigInt(data.leitoId) },
        data: { status: 'ocupado' },
      });
    }

    const updateData: {
      pacienteId?: bigint;
      leitoId?: bigint;
      dataEntrada?: Date;
      dataAlta?: Date | null;
    } = {};
    if (data.pacienteId !== undefined)
      updateData.pacienteId = BigInt(data.pacienteId);
    if (data.leitoId !== undefined) updateData.leitoId = BigInt(data.leitoId);
    if (data.dataEntrada !== undefined)
      updateData.dataEntrada = new Date(data.dataEntrada);
    if (data.dataAlta !== undefined) {
      updateData.dataAlta = data.dataAlta ? new Date(data.dataAlta) : null;
    }

    return this.prisma.internacao.update({
      where: { id: BigInt(id) },
      data: updateData,
      include: {
        paciente: true,
        leito: true,
      },
    });
  }

  async remove(id: number | bigint) {
    const internacao = await this.prisma.internacao.findUnique({
      where: { id: BigInt(id) },
    });

    if (!internacao) {
      throw new NotFoundException('Internação não encontrada.');
    }

    if (internacao.dataAlta === null) {
      await this.prisma.leito.update({
        where: { id: internacao.leitoId },
        data: { status: 'livre' },
      });
    }

    return this.prisma.internacao.delete({
      where: { id: BigInt(id) },
    });
  }

  async alta(id: number | bigint) {
    const internacao = await this.prisma.internacao.findUnique({
      where: { id: BigInt(id) },
    });

    if (!internacao) {
      throw new NotFoundException('Internação não encontrada.');
    }

    if (internacao.dataAlta !== null) {
      throw new BadRequestException('Esta internação já possui alta.');
    }

    const updated = await this.prisma.internacao.update({
      where: { id: BigInt(id) },
      data: { dataAlta: new Date() },
    });

    await this.prisma.leito.update({
      where: { id: internacao.leitoId },
      data: { status: 'livre' },
    });

    return updated;
  }
}
