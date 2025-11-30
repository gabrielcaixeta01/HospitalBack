import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

function toBigInt(id: string | number | bigint): bigint {
  try {
    return typeof id === 'bigint' ? id : BigInt(id);
  } catch {
    throw new BadRequestException('ID inválido.');
  }
}

@Injectable()
export class MedicoEspecialidadeService {
  constructor(private readonly prisma: PrismaService) {}

  async addEspecialidades(medicoIdInput: string | number | bigint, especialidadeIds: Array<string | number | bigint>) {
    const medicoId = toBigInt(medicoIdInput);
    const espIds = especialidadeIds.map(toBigInt);

    const medico = await this.prisma.medico.findUnique({ where: { id: medicoId } });
    if (!medico) throw new NotFoundException('Médico não encontrado.');

    if (!espIds.length) throw new BadRequestException('Informe pelo menos um ID de especialidade.');
    const found = await this.prisma.especialidade.findMany({
      where: { id: { in: espIds } },
      select: { id: true },
    });
    const foundSet = new Set(found.map(e => e.id.toString()));
    const missing = espIds.filter(id => !foundSet.has(id.toString()));
    if (missing.length) {
      throw new BadRequestException(`Especialidade(s) inexistente(s): ${missing.join(', ')}`);
    }

    return this.prisma.medico.update({
      where: { id: medicoId },
      data: {
        especialidades: {
          connect: espIds.map(id => ({ id })),
        },
      },
      include: { especialidades: true },
    });
  }

  async removeEspecialidade(medicoIdInput: string | number | bigint, especialidadeIdInput: string | number | bigint) {
    const medicoId = toBigInt(medicoIdInput);
    const especialidadeId = toBigInt(especialidadeIdInput);

    const medico = await this.prisma.medico.findUnique({ where: { id: medicoId } });
    if (!medico) throw new NotFoundException('Médico não encontrado.');

    return this.prisma.medico.update({
      where: { id: medicoId },
      data: {
        especialidades: {
          disconnect: [{ id: especialidadeId }],
        },
      },
      include: { especialidades: true },
    });
  }

  async listEspecialidadesDoMedico(medicoIdInput: string | number | bigint) {
    const medicoId = toBigInt(medicoIdInput);
    const medico = await this.prisma.medico.findUnique({
      where: { id: medicoId },
      include: { especialidades: true },
    });
    if (!medico) throw new NotFoundException('Médico não encontrado.');
    return medico.especialidades;
  }
}