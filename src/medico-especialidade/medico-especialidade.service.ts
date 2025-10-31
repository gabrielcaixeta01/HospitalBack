/* eslint-disable prettier/prettier */
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

  // Adiciona várias especialidades a um médico
  async addEspecialidades(medicoIdInput: string | number | bigint, especialidadeIds: Array<string | number | bigint>) {
    const medicoId = toBigInt(medicoIdInput);
    const espIds = especialidadeIds.map(toBigInt);

    // valida médico
    const medico = await this.prisma.medico.findUnique({ where: { id: medicoId } });
    if (!medico) throw new NotFoundException('Médico não encontrado.');

    // valida especialidades
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

    // M:N implícito: connect direto no campo "especialidades"
    return this.prisma.medico.update({
      where: { id: medicoId },
      data: {
        especialidades: {
          connect: espIds.map(id => ({ id })),
        },
      },
      include: { especialidades: true }, // ✅ não existe "especialidade" aqui
    });
  }

  // Remove uma especialidade do médico
  async removeEspecialidade(medicoIdInput: string | number | bigint, especialidadeIdInput: string | number | bigint) {
    const medicoId = toBigInt(medicoIdInput);
    const especialidadeId = toBigInt(especialidadeIdInput);

    const medico = await this.prisma.medico.findUnique({ where: { id: medicoId } });
    if (!medico) throw new NotFoundException('Médico não encontrado.');

    // M:N implícito: disconnect
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

  // (opcional) Lista especialidades de um médico
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