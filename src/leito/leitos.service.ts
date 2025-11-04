/* eslint-disable prettier/prettier */
import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateLeitoDto } from './dto/create-leito-dto';
import { UpdateLeitoDto } from './dto/update-leito-dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class LeitosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateLeitoDto) {
    try {
      return await this.prisma.leito.create({
        data: {
          codigo: data.codigo.trim(),
          status: data.status ?? 'livre',
        },
      });
    } catch (err: any) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        throw new ConflictException('Já existe um Leito com esse código.');
      }
      throw err;
    }
  }

  async findAll() {
    return this.prisma.leito.findMany({
      orderBy: { id: 'asc' },
    });
  }

  async findOne(id: number) {
    const leito = await this.prisma.leito.findUnique({ where: { id } });
    if (!leito) throw new NotFoundException(`Leito ${id} não encontrado`);
    return leito;
  }

  async update(id: number, data: UpdateLeitoDto) {
    await this.ensureExists(id);
    try {
      return await this.prisma.leito.update({
        where: { id },
        data: {
          ...(data.codigo !== undefined ? { codigo: data.codigo.trim() } : {}),
          ...(data.status !== undefined ? { status: data.status } : {}),
        },
      });
    } catch (err: any) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        throw new ConflictException('Já existe um Leito com esse código.');
      }
      throw err;
    }
  }

  async updateStatus(id: number, status: 'livre'|'ocupado'|'manutencao') {
    await this.ensureExists(id);
    return this.prisma.leito.update({
      where: { id },
      data: { status },
    });
  }

  async remove(id: number) {
    await this.ensureExists(id);
    try {
      return await this.prisma.leito.delete({ where: { id } });
    } catch (err: any) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2003') {
        throw new BadRequestException('Não é possível remover: Leito vinculado a outro registro (ex.: internação).');
      }
      throw err;
    }
  }

  private async ensureExists(id: number) {
    const found = await this.prisma.leito.findUnique({ where: { id } });
    if (!found) throw new NotFoundException(`Leito ${id} não encontrado.`);
  }
}