import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InternacoesService {
  constructor(private readonly prisma: PrismaService) {}

  private async recalcularStatusDoLeito(leitoId: bigint) {
    const ativa = await this.prisma.internacao.findFirst({
      where: { leitoId, dataAlta: null },
    });

    await this.prisma.leito.update({
      where: { id: leitoId },
      data: { status: ativa ? 'ocupado' : 'livre' },
    });
  }

  async findAll() {
    return this.prisma.internacao.findMany({
      include: { paciente: true, leito: true },
      orderBy: { id: 'asc' },
    });
  }

  async create(data: {
    pacienteId: bigint | number;
    leitoId: bigint | number;
    dataEntrada: Date;
  }) {
    const pacienteId = BigInt(data.pacienteId);
    const leitoId = BigInt(data.leitoId);

    const pacienteAtivo = await this.prisma.internacao.findFirst({
      where: { pacienteId, dataAlta: null },
    });
    if (pacienteAtivo) {
      throw new BadRequestException('O paciente já possui internação ativa.');
    }

    const leito = await this.prisma.leito.findUnique({ where: { id: leitoId } });
    if (!leito) throw new NotFoundException('Leito não encontrado.');

    if (leito.status === 'ocupado')
      throw new BadRequestException('Este leito já está ocupado.');
    if (leito.status === 'manutencao')
      throw new BadRequestException('Este leito está em manutenção.');

    const internacao = await this.prisma.internacao.create({
      data: {
        pacienteId,
        leitoId,
        dataEntrada: new Date(data.dataEntrada),
      },
      include: { paciente: true, leito: true },
    });

    await this.recalcularStatusDoLeito(leitoId);
    return internacao;
  }


  async findOne(id: number | bigint) {
    const internacao = await this.prisma.internacao.findUnique({
      where: { id: BigInt(id) },
      include: { paciente: true, leito: true },
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

    const updateData: any = {};
    if (data.pacienteId !== undefined) updateData.pacienteId = BigInt(data.pacienteId);
    if (data.leitoId !== undefined) updateData.leitoId = BigInt(data.leitoId);
    if (data.dataEntrada !== undefined)
      updateData.dataEntrada = new Date(data.dataEntrada);
    if (data.dataAlta !== undefined)
      updateData.dataAlta = data.dataAlta ? new Date(data.dataAlta) : null;

    const leitoAntigo = internacao.leitoId;
    const leitoNovo = data.leitoId ? BigInt(data.leitoId) : internacao.leitoId;

    if (data.leitoId && leitoNovo !== leitoAntigo) {
      const novo = await this.prisma.leito.findUnique({ where: { id: leitoNovo } });
      if (!novo) throw new NotFoundException('Novo leito não encontrado.');
      if (novo.status === 'ocupado')
        throw new BadRequestException('O novo leito já está ocupado.');
      if (novo.status === 'manutencao')
        throw new BadRequestException('O novo leito está em manutenção.');
    }

    const updated = await this.prisma.internacao.update({
      where: { id: BigInt(id) },
      data: updateData,
      include: { paciente: true, leito: true },
    });

    await this.recalcularStatusDoLeito(leitoAntigo);
    await this.recalcularStatusDoLeito(leitoNovo);

    return updated;
  }

  async remove(id: number | bigint) {
    const interna = await this.prisma.internacao.findUnique({
      where: { id: BigInt(id) },
    });

    if (!interna) {
      throw new NotFoundException('Internação não encontrada.');
    }

    const deleted = await this.prisma.internacao.delete({
      where: { id: BigInt(id) },
    });

    await this.recalcularStatusDoLeito(interna.leitoId);
    return deleted;
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

    await this.recalcularStatusDoLeito(internacao.leitoId);

    return updated;
  }
}