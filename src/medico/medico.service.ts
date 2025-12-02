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
      include: {
        especialidades: true,
      },
      orderBy: { id: 'asc' },
    });
  }

  async findOne(id: number) {
    await this.ensureMedicoExists(id);

    return this.prisma.medico.findUnique({
      where: { id },
      include: {
        especialidades: true,
        consulta: true,
      },
    });
  }

  async create(data: CreateMedicoDto) {
    const { especialidadesIds, ...rest } = data;

    return this.prisma.medico.create({
      data: {
        ...rest,
        especialidades: especialidadesIds?.length
          ? {
              connect: especialidadesIds.map((id) => ({ id })),
            }
          : undefined,
      },
      include: { especialidades: true },
    });
  }

  async update(id: number, data: UpdateMedicoDto) {
    await this.ensureMedicoExists(id);

    const {
      replaceEspecialidadesIds,
      especialidadesIdsToConnect,
      especialidadesIdsToDisconnect,
      ...rest
    } = data;

    // atualiza campos básicos do médico
    await this.prisma.medico.update({
      where: { id },
      data: rest,
    });

    // substituir TODAS as especialidades
    if (replaceEspecialidadesIds) {
      await this.prisma.medico.update({
        where: { id },
        data: {
          especialidades: {
            set: replaceEspecialidadesIds.map((eId) => ({ id: eId })),
          },
        },
      });
    }

    // conectar novas
    if (especialidadesIdsToConnect?.length) {
      await this.prisma.medico.update({
        where: { id },
        data: {
          especialidades: {
            connect: especialidadesIdsToConnect.map((eId: any) => ({ id: eId })),
          },
        },
      });
    }

    // desconectar algumas
    if (especialidadesIdsToDisconnect?.length) {
      await this.prisma.medico.update({
        where: { id },
        data: {
          especialidades: {
            disconnect: especialidadesIdsToDisconnect.map((eId: any) => ({ id: eId })),
          },
        },
      });
    }

    return this.findOne(id);
  }

  async delete(id: number) {
    await this.ensureMedicoExists(id);

    return this.prisma.medico.delete({
      where: { id },
    });
  }
}