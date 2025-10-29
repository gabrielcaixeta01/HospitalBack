import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePacienteDto } from './dto/create-paciente-dto';
import { UpdatePacienteDto } from './dto/update-paciente-dto';

@Injectable()
export class PacientesService {
  constructor(private readonly prisma: PrismaService) {}

  // Cria um paciente e associa especialidades
  async create(data: CreatePacienteDto) {
    const { nome, cpf, dataNascimento, sexo, telefone, email, observacoes } =
      data;

    const sexoValue = sexo != null ? String(sexo) : undefined;

    return await this.prisma.paciente.create({
      data: {
        nome,
        cpf,
        dataNascimento,
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
    const updatePayload: Partial<UpdatePacienteDto> = { ...data };

    return await this.prisma.paciente.update({
      where: {
        id,
      },
      data: updatePayload,
    });
  }
}
