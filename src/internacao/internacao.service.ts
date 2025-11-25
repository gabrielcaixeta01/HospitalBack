import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InternacoesService {
  constructor(private readonly prisma: PrismaService) {}

  // ---------------------------------------------------------------------------
  // LISTAR TODAS COM PACIENTE + LEITO
  // ---------------------------------------------------------------------------
  async findAll() {
    return this.prisma.internacao.findMany({
      include: {
        paciente: true,
        leito: true,
      },
      orderBy: { id: 'asc' },
    });
  }

  // ---------------------------------------------------------------------------
  // CRIAR INTERNAÇÃO
  // ---------------------------------------------------------------------------
  async create(data: {
    pacienteId: bigint | number;
    leitoId: bigint | number;
    dataEntrada: Date;
  }) {
    // Verifica se o paciente já está internado
    const pacienteJaInternado = await this.prisma.internacao.findFirst({
      where: { pacienteId: BigInt(data.pacienteId), dataAlta: null },
    });

    if (pacienteJaInternado) {
      throw new BadRequestException(
        'O paciente já possui uma internação ativa.',
      );
    }

    // Verifica se o leito existe
    const leito = await this.prisma.leito.findUnique({
      where: { id: BigInt(data.leitoId) },
    });

    if (!leito) {
      throw new NotFoundException('Leito não encontrado.');
    }

    // Verifica se o leito está ocupado
    if (leito.status === 'ocupado') {
      throw new BadRequestException('Este leito já está ocupado.');
    }

    // Verifica se o leito está em manutenção
    if (leito.status === 'manutencao') {
      throw new BadRequestException('Este leito está em manutenção.');
    }

    // Criar internação
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

    // Atualizar status do leito para "ocupado"
    await this.prisma.leito.update({
      where: { id: BigInt(data.leitoId) },
      data: { status: 'ocupado' },
    });

    return internacao;
  }

  // ---------------------------------------------------------------------------
  // BUSCAR UMA INTERNAÇÃO
  // ---------------------------------------------------------------------------
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

  // ---------------------------------------------------------------------------
  // ATUALIZAR INTERNAÇÃO
  // ---------------------------------------------------------------------------
  async update(
    id: number | bigint,
    data: {
      pacienteId?: number;
      leitoId?: number;
      dataEntrada?: string;
      dataAlta?: string | null;
    },
  ) {
    // Verifica se a internação existe
    const internacao = await this.prisma.internacao.findUnique({
      where: { id: BigInt(id) },
    });

    if (!internacao) {
      throw new NotFoundException('Internação não encontrada.');
    }

    // Se estiver alterando o leito
    if (data.leitoId && BigInt(data.leitoId) !== internacao.leitoId) {
      // Verifica se o novo leito existe
      const novoLeito = await this.prisma.leito.findUnique({
        where: { id: BigInt(data.leitoId) },
      });

      if (!novoLeito) {
        throw new NotFoundException('Leito não encontrado.');
      }

      // Verifica se o novo leito está disponível
      if (novoLeito.status === 'ocupado') {
        throw new BadRequestException('Este leito já está ocupado.');
      }

      if (novoLeito.status === 'manutencao') {
        throw new BadRequestException('Este leito está em manutenção.');
      }

      // Libera o leito antigo (se a internação ainda não teve alta)
      if (internacao.dataAlta === null) {
        await this.prisma.leito.update({
          where: { id: internacao.leitoId },
          data: { status: 'livre' },
        });
      }

      // Ocupa o novo leito
      await this.prisma.leito.update({
        where: { id: BigInt(data.leitoId) },
        data: { status: 'ocupado' },
      });
    }

    // Atualiza a internação
    const updateData: any = {};
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

  // ---------------------------------------------------------------------------
  // REMOVER INTERNAÇÃO
  // ---------------------------------------------------------------------------
  async remove(id: number | bigint) {
    const internacao = await this.prisma.internacao.findUnique({
      where: { id: BigInt(id) },
    });

    if (!internacao) {
      throw new NotFoundException('Internação não encontrada.');
    }

    // Se a internação ainda não teve alta, libera o leito
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

  // ---------------------------------------------------------------------------
  // DAR ALTA
  // ---------------------------------------------------------------------------
  async alta(id: number | bigint) {
    // Busca internação ativa
    const internacao = await this.prisma.internacao.findUnique({
      where: { id: BigInt(id) },
    });

    if (!internacao) {
      throw new NotFoundException('Internação não encontrada.');
    }

    if (internacao.dataAlta !== null) {
      throw new BadRequestException('Esta internação já possui alta.');
    }

    // Dar alta
    const updated = await this.prisma.internacao.update({
      where: { id: BigInt(id) },
      data: { dataAlta: new Date() },
    });

    // Liberar leito
    await this.prisma.leito.update({
      where: { id: internacao.leitoId },
      data: { status: 'livre' },
    });

    return updated;
  }
}
