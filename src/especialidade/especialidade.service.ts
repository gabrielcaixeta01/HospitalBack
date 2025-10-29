import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEspecialidadeDto } from './dto/create-especialidade-dto';
import { UpdateEspecialidadeDto } from './dto/update-especialidade-dto';

@Injectable()
export class EspecialidadesService {
  constructor(private readonly prisma: PrismaService) {}

  // Cria uma especialidade
  async create(data: CreateEspecialidadeDto) {
    const { nome } = data;

    return await this.prisma.especialidade.create({
      data: {
        nome,
      },
    });
  }

  // Retorna todas as especialidades
  async findAll() {
    return await this.prisma.especialidade.findMany({});
  }

  async findEspecialidade(id: number) {
    const especialidade = await this.prisma.especialidade.findUnique({
      where: { id },
    });

    if (!especialidade) {
      throw new NotFoundException(`Especialidade com ID ${id} não encontrada.`);
    }

    return especialidade;
  }

  async deleteEspecialidade(id: number) {
    const especialidade = await this.prisma.especialidade.findUnique({
      where: { id },
    });

    if (!especialidade) {
      throw new NotFoundException(`Especialidade com ID ${id} não encontrada.`);
    }

    return await this.prisma.especialidade.delete({
      where: {
        id,
      },
    });
  }

  // Atualiza uma especialidade
  async updateEspecialidade(id: number, data: UpdateEspecialidadeDto) {
    const { ...updateData } = data;

    return await this.prisma.especialidade.update({
      where: {
        id,
      },
      data: {
        ...updateData,
      },
    });
  }
}
