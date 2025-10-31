/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePacienteDto } from './dto/create-paciente-dto';
import { UpdatePacienteDto } from './dto/update-paciente-dto';
import type { Sexo } from '@prisma/client';

function toDateOrThrow(input: string | Date): Date {
  if (input instanceof Date) {
    if (Number.isNaN(input.getTime())) throw new BadRequestException('dataNascimento inválida');
    return input;
  }
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) {
    throw new BadRequestException('dataNascimento inválida (use ISO 8601, ex: 1990-04-12)');
  }
  return d;
}
const cleanCpf = (cpf: string) => cpf.replace(/\D/g, '').trim();

@Injectable()
export class PacientesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreatePacienteDto) {
    const { nome, cpf, dataNascimento, sexo, telefone, email, observacoes } = data;

    const nomeNorm = nome.trim();
    const cpfNorm = cleanCpf(cpf);
    const emailNorm = email.trim().toLowerCase();
    const nascimento = toDateOrThrow(dataNascimento);

    let sexoValue: Sexo | undefined;
    if (sexo != null) {
      if (sexo === 'M' || sexo === 'F' || sexo === 'O') sexoValue = sexo as Sexo;
      else throw new BadRequestException('Valor de sexo inválido (use M | F | O)');
    }

    try {
      return await this.prisma.paciente.create({
        data: {
          nome: nomeNorm,
          cpf: cpfNorm,
          nascimento,
          sexo: sexoValue,
          telefone: telefone?.trim(),
          email: emailNorm,
          observacoes: observacoes?.trim(),
        },
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        const target = ((err.meta?.target as string[]) ?? []).join(', ') || 'campo único';
        throw new BadRequestException(`Já existe paciente com ${target}.`);
      }
      throw err;
    }
  }

  async findAll() {
    return this.prisma.paciente.findMany({ orderBy: { id: 'asc' } });
  }

  async findPaciente(id: number) {
    const paciente = await this.prisma.paciente.findUnique({ where: { id } });
    if (!paciente) throw new NotFoundException(`Paciente com ID ${id} não encontrado.`);
    return paciente;
  }

  async deletePaciente(id: number) {
    try {
      return await this.prisma.paciente.delete({ where: { id } });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
        throw new NotFoundException(`Paciente com ID ${id} não encontrado.`);
      }
      throw err;
    }
  }

  async updatePaciente(id: number, data: UpdatePacienteDto) {
    const updateData: Prisma.PacienteUpdateInput = {};

    if (data.nome != null) updateData.nome = data.nome.trim();
    if (data.cpf != null) updateData.cpf = cleanCpf(data.cpf);
    if (data.email != null) updateData.email = data.email.trim().toLowerCase();
    if (data.telefone != null) updateData.telefone = data.telefone.trim();
    if (data.observacoes != null) updateData.observacoes = data.observacoes.trim();

    if (data.sexo != null) {
      const s = data.sexo as string;
      if (s === 'M' || s === 'F' || s === 'O') updateData.sexo = s as Sexo;
      else throw new BadRequestException('Valor de sexo inválido (use M | F | O)');
    }

    if (data.dataNascimento != null) {
      updateData.nascimento = toDateOrThrow(data.dataNascimento);
    }

    try {
      return await this.prisma.paciente.update({ where: { id }, data: updateData });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2025') throw new NotFoundException(`Paciente com ID ${id} não encontrado.`);
        if (err.code === 'P2002') {
          const target = ((err.meta?.target as string[]) ?? []).join(', ') || 'campo único';
          throw new BadRequestException(`Conflito de unicidade em ${target}.`);
        }
      }
      throw err;
    }
  }
}