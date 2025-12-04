import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LeitoService {
  constructor(private prisma: PrismaService) {}

  private async recalcularStatusDoLeito(leitoId: bigint) {
    const ativa = await this.prisma.internacao.findFirst({
      where: { leitoId, dataAlta: null },
    });

    const leito = await this.prisma.leito.findUnique({
      where: { id: leitoId },
    });

    if (!leito) throw new NotFoundException('Leito não encontrado.');

    if (leito.status === 'manutencao') {
      if (ativa) {
        await this.prisma.leito.update({
          where: { id: leitoId },
          data: { status: 'ocupado' },
        });
      }
      return;
    }

    await this.prisma.leito.update({
      where: { id: leitoId },
      data: { status: ativa ? 'ocupado' : 'livre' },
    });
  }


  async findAll() {
    const leitos = await this.prisma.leito.findMany({
      orderBy: { id: 'asc' },
    });

    const ativas = await this.prisma.$queryRaw<
      { leitoId: bigint; nome_paciente: string }[]
    >`SELECT "leitoId", nome_paciente FROM internacoes_ativas_detalhes`;

    const mapa = new Map<number, string>();
    for (const i of ativas) {
      mapa.set(Number(i.leitoId), i.nome_paciente);
    }

    return leitos.map((l) => ({
      ...l,
      pacienteNome: mapa.get(Number(l.id)) ?? null,
      status: mapa.has(Number(l.id)) ? 'ocupado' : l.status,
    }));
  }

  
  async findOne(id: number) {
    const leito = await this.prisma.leito.findUnique({
      where: { id },
      include: {
        internacao: {
          where: { dataAlta: null },
          include: { paciente: true },
        },
      },
    });

    if (!leito) throw new NotFoundException('Leito não encontrado.');

    return leito;
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
    const leito = await this.prisma.leito.update({
      where: { id },
      data,
    });

   
    await this.recalcularStatusDoLeito(BigInt(id));

    return leito;
  }


  async updateStatus(
    id: number,
    status: 'livre' | 'ocupado' | 'manutencao',
  ) {
    const leitoId = BigInt(id);

    await this.prisma.leito.update({
      where: { id: leitoId },
      data: { status },
    });

    await this.recalcularStatusDoLeito(leitoId);

    return this.findOne(id);
  }

  async remove(id: number) {
    const deleted = await this.prisma.leito.delete({
      where: { id },
    });

    return deleted;
  }
}