/* eslint-disable prettier/prettier */
import { CreatePacienteDto } from './dto/create-paciente-dto';
import { UpdatePacienteDto } from './dto/update-paciente-dto';
import { PacientesService } from './paciente.service';
import {
  Body,
  Controller,
  Post,
  Get,
  ValidationPipe,
  Param,
  ParseIntPipe,
  Delete,
  Patch,
  NotFoundException,
} from '@nestjs/common';

@Controller('pacientes')
export class PacientesController {
  constructor(private readonly pacientesService: PacientesService) {}

  @Post()
  async create(@Body(ValidationPipe) pacienteData: CreatePacienteDto) {
    return this.pacientesService.create(pacienteData);
  }

  @Get()
  findAll() {
    return this.pacientesService.findAll();
  }

  @Get(':id')
  async findPaciente(@Param('id', ParseIntPipe) id: number) {
    const paciente = await this.pacientesService.findPaciente(id);
    if (!paciente) {
      throw new NotFoundException(`Paciente com ID ${id} não encontrado.`);
    }
    return paciente;
  }

  @Delete(':id')
  async deletePaciente(@Param('id', ParseIntPipe) id: number) {
    return this.pacientesService.deletePaciente(id);
  }

  @Patch(':id')
  async updatePaciente(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) data: UpdatePacienteDto,
  ) {
    return this.pacientesService.updatePaciente(id, data);
  }
}
