/* eslint-disable prettier/prettier */
import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateMedicoDto } from './dto/create-medico-dto';
import { UpdateMedicoDto } from './dto/update-medico-dto';

@Injectable()
export class MedicosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateMedicoDto) {
    const { nome, crm, telefone, email, especialidadeIds } = data;

    if (Array.isArray(especialidadeIds) && especialidadeIds.length > 0) {
      const found = await this.prisma.especialidade.findMany({
        where: { id: { in: especialidadeIds } },
        select: { id: true },
      });
      const foundIds = new Set(found.map((e) => Number(e.id)));
      const missing = especialidadeIds.filter((id) => !foundIds.has(Number(id)));
      if (missing.length) {
        throw new BadRequestException(
          `Especialidade(s) inexistente(s): ${missing.join(', ')}`,
        );
      }
    }

    try {
      return await this.prisma.medico.create({
        data: {
          nome: nome?.trim(),
          crm: crm?.trim(),
          telefone: telefone?.trim(),
          email: email?.trim().toLowerCase(),
          ...(Array.isArray(especialidadeIds) && especialidadeIds.length > 0
            ? {
                especialidades: {
                  connect: (especialidadeIds ?? []).map((id) => ({ id: BigInt(id) })),
                },
              }
            : {}),
        },
        include: { especialidades: true },
      });
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2002'
      ) {
        throw new ConflictException(
          'Já existe um médico com o mesmo CRM ou e-mail.',
        );
      }
      throw err;
    }
  }

  async findAll() {
    return this.prisma.medico.findMany({
      include: { especialidades: true },
      orderBy: { id: 'asc' },
    });
  }

  async findMedico(id: number) {
    const numericId = Number(id);
    if (!Number.isInteger(numericId) || numericId <= 0) {
      throw new BadRequestException('ID inválido.');
    }

    const medico = await this.prisma.medico.findUnique({
      where: { id: numericId },
      include: { especialidades: true },
    });
    if (!medico) {
      throw new NotFoundException(`Médico com ID ${numericId} não encontrado.`);
    }
    return medico;
  }

  async deleteMedico(id: number) {
    const numericId = Number(id);
    if (!Number.isInteger(numericId) || numericId <= 0) {
      throw new BadRequestException('ID inválido.');
    }

    await this.ensureExists(numericId);
    return this.prisma.medico.delete({ where: { id: numericId } });
  }

  async updateMedico(id: number, data: UpdateMedicoDto) {
    const numericId = Number(id);
    if (!Number.isInteger(numericId) || numericId <= 0) {
      throw new BadRequestException('ID inválido.');
    }
    await this.ensureExists(numericId);

    const {
      nome,
      crm,
      telefone,
      email,
      especialidadeIdsToConnect,
      especialidadeIdsToDisconnect,
      replaceEspecialidadeIds,
    } = data;

    const idsToValidate = (replaceEspecialidadeIds ?? [])
      .concat(especialidadeIdsToConnect ?? []);
    if (idsToValidate.length > 0) {
      const found = await this.prisma.especialidade.findMany({
        where: { id: { in: idsToValidate } },
        select: { id: true },
      });
      const foundIds = new Set(found.map((e) => Number(e.id)));
      const missing = idsToValidate.filter((id) => !foundIds.has(Number(id)));
      if (missing.length) {
        throw new BadRequestException(
          `Especialidade(s) inexistente(s): ${missing.join(', ')}`,
        );
      }
    }

    const relationMutation: Prisma.MedicoUpdateInput['especialidades'] =
      Array.isArray(replaceEspecialidadeIds)
        ? {
            set: replaceEspecialidadeIds.map((eid) => ({ id: eid })),
          }
        : {
            ...(Array.isArray(especialidadeIdsToConnect) &&
            especialidadeIdsToConnect.length > 0
              ? { connect: especialidadeIdsToConnect.map((eid) => ({ id: eid })) }
              : {}),
            ...(Array.isArray(especialidadeIdsToDisconnect) &&
            especialidadeIdsToDisconnect.length > 0
              ? {
                  disconnect: especialidadeIdsToDisconnect.map((eid) => ({ id: eid })),
                }
              : {}),
          };

    try {
      return await this.prisma.medico.update({
        where: { id: numericId },
        data: {
          ...(nome !== undefined ? { nome: nome.trim() } : {}),
          ...(crm !== undefined ? { crm: crm.trim() } : {}),
          ...(telefone !== undefined ? { telefone: telefone.trim() } : {}),
          ...(email !== undefined ? { email: email.trim().toLowerCase() } : {}),
          ...(
            relationMutation &&
            ('connect' in relationMutation ||
              'disconnect' in relationMutation ||
              'set' in relationMutation)
              ? { especialidades: relationMutation }
              : {}
          ),
        },
        include: { especialidades: true },
      });
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2002'
      ) {
        throw new ConflictException(
          'Já existe um médico com o mesmo CRM ou e-mail.',
        );
      }
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2025'
      ) {
        throw new NotFoundException(
          'Recurso relacionado não encontrado ao atualizar as especialidades.',
        );
      }
      throw err;
    }
  }

  private async ensureExists(id: number) {
    const found = await this.prisma.medico.findUnique({ where: { id } });
    if (!found) throw new NotFoundException(`Médico com ID ${id} não encontrado.`);
  }
}