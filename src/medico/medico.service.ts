/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateMedicoDto } from './dto/create-medico-dto';   
import { UpdateMedicoDto } from './dto/update-medico-dto';  

@Injectable()
export class MedicosService {
  constructor(private readonly prisma: PrismaService) {}

  // Cria um médico e (opcionalmente) associa especialidades
  async create(data: CreateMedicoDto) {
    const { nome, crm, telefone, email, especialidadeIds } = data;

    try {
      return await this.prisma.medico.create({
        data: {
          nome,
          crm,
          telefone,
          email,
          ...(Array.isArray(especialidadeIds) && especialidadeIds.length > 0
            ? {
                especialidades: {
                  connect: especialidadeIds.map((id) => ({ id })),
                },
              }
            : {}),
        },
        include: { especialidades: true },
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        // Violação de unicidade (ex.: crm ou email únicos)
        throw new ConflictException('Já existe um médico com o mesmo CRM ou e-mail.');
      }
      throw err;
    }
  }

  // Retorna todos os médicos com suas especialidades
  async findAll() {
    return this.prisma.medico.findMany({
      include: { especialidades: true },
      orderBy: { id: 'asc' },
    });
  }

  // Busca 1 médico (com especialidades)
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

  // Remove 1 médico
  async deleteMedico(id: number) {
    const numericId = Number(id);
    if (!Number.isInteger(numericId) || numericId <= 0) {
      throw new BadRequestException('ID inválido.');
    }

    // opcional: checar existência antes para mensagem 404 amigável
    await this.ensureExists(numericId);

    return this.prisma.medico.delete({
      where: { id: numericId },
    });
  }

  // Atualiza dados do médico e permite associar/desassociar especialidades
  async updateMedico(id: number, data: UpdateMedicoDto) {
    const numericId = Number(id);
    if (!Number.isInteger(numericId) || numericId <= 0) {
      throw new BadRequestException('ID inválido.');
    }

    // garante 404 claro caso não exista
    await this.ensureExists(numericId);

    const {
      nome,
      crm,
      telefone,
      email,
      // listas opcionais para mexer nas relações
      especialidadeIdsToConnect,
      especialidadeIdsToDisconnect,
      // sobrescrever completamente (opcional)
      replaceEspecialidadeIds,
    } = data;

    // Estratégia:
    // - Se "replaceEspecialidadeIds" vier, substitui o conjunto todo (set).
    // - Senão, aplica connect/disconnect incrementais se fornecidos.
    const relationMutation: Prisma.MedicoUpdateInput['especialidades'] =
      Array.isArray(replaceEspecialidadeIds)
        ? {
            set: replaceEspecialidadeIds.map((eid) => ({ id: eid })),
          }
        : {
            ...(Array.isArray(especialidadeIdsToConnect) && especialidadeIdsToConnect.length > 0
              ? { connect: especialidadeIdsToConnect.map((eid) => ({ id: eid })) }
              : {}),
            ...(Array.isArray(especialidadeIdsToDisconnect) && especialidadeIdsToDisconnect.length > 0
              ? { disconnect: especialidadeIdsToDisconnect.map((eid) => ({ id: eid })) }
              : {}),
          };

    try {
      return await this.prisma.medico.update({
        where: { id: numericId },
        data: {
          ...(nome !== undefined ? { nome } : {}),
          ...(crm !== undefined ? { crm } : {}),
          ...(telefone !== undefined ? { telefone } : {}),
          ...(email !== undefined ? { email } : {}),
          // só envia a relação se houver algo a fazer (evita sobrescrever sem querer)
          ...((relationMutation.connect ||
            relationMutation.disconnect ||
            relationMutation.set) && { especialidades: relationMutation }),
        },
        include: { especialidades: true },
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        throw new ConflictException('Já existe um médico com o mesmo CRM ou e-mail.');
      }
      // P2025 também pode ocorrer aqui se tentar desconectar algo inexistente
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
        throw new NotFoundException('Recurso relacionado não encontrado ao atualizar as especialidades.');
      }
      throw err;
    }
  }

  // Utilitário: garante que o médico existe ou lança 404
  private async ensureExists(id: number) {
    const found = await this.prisma.medico.findUnique({ where: { id } });
    if (!found) throw new NotFoundException(`Médico com ID ${id} não encontrado.`);
  }
}