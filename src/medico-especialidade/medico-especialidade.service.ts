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
    const foundSet = new Set(found.map((e: any) => e.id.toString()));
    const missing = espIds.filter(id => !foundSet.has(id.toString()));
    if (missing.length) {
      throw new BadRequestException(`Especialidade(s) inexistente(s): ${missing.join(', ')}`);
    }

    await Promise.all(
      espIds.map(espId =>
        this.prisma.medicoEspecialidade.upsert({
          where: { medicoId_especialidadeId: { medicoId, especialidadeId: espId } },
          update: {},
          create: { medicoId, especialidadeId: espId },
        })
      )
    );

    return this.prisma.medico.findUnique({
      where: { id: medicoId },
      include: { medicoEspecialidade: { include: { especialidade: true } } },
    });
  }

  async removeEspecialidade(medicoIdInput: string | number | bigint, especialidadeIdInput: string | number | bigint) {
    const medicoId = toBigInt(medicoIdInput);
    const especialidadeId = toBigInt(especialidadeIdInput);

    const medico = await this.prisma.medico.findUnique({ where: { id: medicoId } });
    if (!medico) throw new NotFoundException('Médico não encontrado.');

    await this.prisma.medicoEspecialidade.delete({
      where: { medicoId_especialidadeId: { medicoId, especialidadeId } },
    }).catch(() => {
      throw new NotFoundException('Relação médico-especialidade não encontrada.');
    });

    return this.prisma.medico.findUnique({
      where: { id: medicoId },
      include: { medicoEspecialidade: { include: { especialidade: true } } },
    });
  }

  async listEspecialidadesDoMedico(medicoIdInput: string | number | bigint) {
    const medicoId = toBigInt(medicoIdInput);
    const medico = await this.prisma.medico.findUnique({
      where: { id: medicoId },
      include: { medicoEspecialidade: { include: { especialidade: true } } },
    });
    if (!medico) throw new NotFoundException('Médico não encontrado.');
    return medico.medicoEspecialidade.map(me => me.especialidade);
  }
}