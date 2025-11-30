import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEspecialidadeDto } from './dto/create-especialidade-dto';
import { UpdateEspecialidadeDto } from './dto/update-especialidade-dto';

function toBigInt(id: string | number | bigint): bigint {
  try { return typeof id === 'bigint' ? id : BigInt(id); } 
  catch { throw new BadRequestException('ID inválido.'); }
}

@Injectable()
export class EspecialidadesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateEspecialidadeDto) {
    try {
      return await this.prisma.especialidade.create({
        data: { nome: data.nome.trim() },
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        throw new BadRequestException('Especialidade já existe.');
      }
      throw err;
    }
  }

  findAll() {
    return this.prisma.especialidade.findMany({ orderBy: { id: 'asc' } });
  }

  async findOne(idParam: string) {
    const id = toBigInt(idParam);
    const esp = await this.prisma.especialidade.findUnique({ where: { id } });
    if (!esp) throw new NotFoundException('Especialidade não encontrada.');
    return esp;
  }

  async update(idParam: string, data: UpdateEspecialidadeDto) {
    const id = toBigInt(idParam);
    try {
      return await this.prisma.especialidade.update({
        where: { id },
        data: { ...(data.nome ? { nome: data.nome.trim() } : {}) },
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
        throw new NotFoundException('Especialidade não encontrada.');
      }
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        throw new BadRequestException('Já existe uma especialidade com esse nome.');
      }
      throw err;
    }
  }

  async remove(idParam: string) {
    const id = toBigInt(idParam);
    try {
      return await this.prisma.especialidade.delete({ where: { id } });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
        throw new NotFoundException('Especialidade não encontrada.');
      }
      throw err;
    }
  }
}