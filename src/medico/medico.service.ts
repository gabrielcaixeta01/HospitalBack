import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMedicoDto } from './dto/create-medico-dto';
import { UpdateMedicoDto } from './dto/update-medico-dto';

@Injectable()
export class MedicosService {
  constructor(private readonly prisma: PrismaService) {}

  // Cria um médico e associa especialidades
  async create(data: CreateMedicoDto) {
    const { nome, crm, telefone, email } = data;

    return await this.prisma.medico.create({
      data: {
        nome,
        crm,
        telefone,
        email,
      },
    });
  }

  // Retorna todos os médicos com suas especialidades
  async findAll() {
    return await this.prisma.medico.findMany({
      include: {
        especialidades: true,
      },
    });
  }

  async findMedico(id: number) {
    const medico = await this.prisma.medico.findUnique({
      where: { id },
    });

    if (!medico) {
      throw new NotFoundException(`Médico com ID ${id} não encontrado.`);
    }

    return medico;
  }

  async deleteMedico(id: number) {
    const medico = await this.prisma.medico.findUnique({ where: { id } });

    if (!medico) {
      throw new NotFoundException(`Médico com ID ${id} não encontrado.`);
    }

    return await this.prisma.medico.delete({
      where: {
        id,
      },
    });
  }

  // Atualiza um médico e associa/desassocia especialidades
  async updateMedico(id: number, data: UpdateMedicoDto) {
    const { ...updateData } = data;

    return await this.prisma.medico.update({
      where: {
        id,
      },
      data: {
        ...updateData,
      },
    });
  }
}
