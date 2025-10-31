/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma as PrismaNS } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEspecialidadeDto } from './dto/create-especialidade-dto';

@Injectable()
export class EspecialidadesService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateEspecialidadeDto) {
    return this.prisma.especialidade.create({
      data: { nome: data.nome.trim() },
    }).catch((err) => {
      if (err instanceof PrismaNS.PrismaClientKnownRequestError && err.code === 'P2002') {
        throw new BadRequestException('Especialidade já existe.');
      }
      throw err;
    });
  }

  findAll() {
    return this.prisma.especialidade.findMany({ orderBy: { id: 'asc' } });
  }

  async findOne(id: number) {
    const esp = await this.prisma.especialidade.findUnique({ where: { id } });
    if (!esp) throw new NotFoundException('Especialidade não encontrada.');
    return esp;
  }

  async remove(id: number) {
    try {
      return await this.prisma.especialidade.delete({ where: { id } });
    } catch (err) {
      if (err instanceof PrismaNS.PrismaClientKnownRequestError && err.code === 'P2025') {
        throw new NotFoundException('Especialidade não encontrada.');
      }
      throw err;
    }
  }
}