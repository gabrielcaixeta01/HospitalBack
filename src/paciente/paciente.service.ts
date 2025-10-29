import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePacienteDto } from './dto/create-paciente-dto';
import { UpdatePacienteDto } from './dto/update-paciente-dto';
import type { Sexo } from '@prisma/client';

@Injectable()
export class PacientesService {
  constructor(private readonly prisma: PrismaService) {}

  // Cria um paciente e associa especialidades
  async create(data: CreatePacienteDto) {
    const { nome, cpf, dataNascimento, sexo, telefone, email, observacoes } =
      data;

    let sexoValue: Sexo | undefined = undefined;
    if (sexo != null) {
      if (sexo === 'M' || sexo === 'F' || sexo === 'O')
        sexoValue = sexo as Sexo;
      else throw new Error('Valor de sexo inválido');
    }

    return await this.prisma.paciente.create({
      data: {
        nome,
        cpf,
        nascimento: dataNascimento,
        sexo: sexoValue,
        telefone,
        email,
        observacoes,
      },
    });
  }

  // Retorna todos os pacientes com suas especialidades
  async findAll() {
    return await this.prisma.paciente.findMany({});
  }

  async findPaciente(id: number) {
    const paciente = await this.prisma.paciente.findUnique({
      where: { id },
    });

    if (!paciente) {
      throw new NotFoundException(`Paciente com ID ${id} não encontrado.`);
    }

    return paciente;
  }

  async deletePaciente(id: number) {
    const paciente = await this.prisma.paciente.findUnique({ where: { id } });

    if (!paciente) {
      throw new NotFoundException(`Paciente com ID ${id} não encontrado.`);
    }

    return await this.prisma.paciente.delete({
      where: {
        id,
      },
    });
  }

  // Atualiza um paciente e associa/desassocia especialidades
  async updatePaciente(id: number, data: UpdatePacienteDto) {
    const updatePayload: Partial<Record<string, unknown>> = { ...data };
    if (updatePayload.sexo != null) {
      const s = updatePayload.sexo as unknown as string;
      if (s === 'M' || s === 'F' || s === 'O') updatePayload.sexo = s;
      else throw new Error('Valor de sexo inválido');
    }
    if (updatePayload.dataNascimento != null) {
      updatePayload.nascimento = updatePayload.dataNascimento;
      delete updatePayload.dataNascimento;
    }

    return await this.prisma.paciente.update({
      where: {
        id,
      },
      data: updatePayload as any,
    });
  }
}
