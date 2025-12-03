import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMedicoDto } from './dto/create-medico-dto';
import { UpdateMedicoDto } from './dto/update-medico-dto';

@Injectable()
export class MedicosService {
  constructor(private readonly prisma: PrismaService) {}

  private async ensureMedicoExists(id: number) {
    const medico = await this.prisma.medico.findUnique({ where: { id } });
    if (!medico) {
      throw new NotFoundException(`Médico com ID ${id} não encontrado.`);
    }
  }

  async findAll() {
    return this.prisma.medico.findMany({
      include: { especialidade: true },
      orderBy: { id: 'asc' },
    });
  }

  async findOne(id: number) {
    await this.ensureMedicoExists(id);

    return this.prisma.medico.findUnique({
      where: { id },
      include: {
        especialidade: true,
        consulta: true,
      },
    });
  }

  async create(data: CreateMedicoDto) {
    const { especialidadeIds, ...rest } = data;

    return this.prisma.medico.create({
      data: {
        ...rest,
        especialidade: especialidadeIds?.length
          ? { connect: especialidadeIds.map((id) => ({ id })) }
          : undefined,
      },
      include: { especialidade: true },
    });
  }

  async update(id: number, data: UpdateMedicoDto) {
    await this.ensureMedicoExists(id);

    const {
      replaceEspecialidadeIds,
      especialidadeIdsToConnect,
      especialidadeIdsToDisconnect,
      ...rest
    } = data;

    return this.prisma.medico.update({
      where: { id },
      data: {
        ...rest,

        especialidade: {
          ...(replaceEspecialidadeIds
            ? { set: replaceEspecialidadeIds.map((eId) => ({ id: eId })) }
            : {}),

          ...(especialidadeIdsToConnect?.length
            ? { connect: especialidadeIdsToConnect.map((eId) => ({ id: eId })) }
            : {}),

          ...(especialidadeIdsToDisconnect?.length
            ? {
                disconnect: especialidadeIdsToDisconnect.map((eId) => ({ id: eId })),
              }
            : {}),
        },
      },
      include: { especialidade: true },
    });
  }

  async delete(id: number) {
    await this.ensureMedicoExists(id);
    return this.prisma.medico.delete({ where: { id } });
  }
}