import { Public } from 'src/auth/decorators/public.decorator';
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

  // Cria um paciente
  @Public()
  @Post()
  async create(@Body(ValidationPipe) pacienteData: CreatePacienteDto) {
    return this.pacientesService.create(pacienteData);
  }

  // Retorna todos os pacientes
  @Public()
  @Get()
  findAll() {
    return this.pacientesService.findAll();
  }

  // Retorna um paciente específico pelo ID
  @Public()
  @Get(':id')
  async findPaciente(@Param('id', ParseIntPipe) id: number) {
    const paciente = await this.pacientesService.findPaciente(id);
    if (!paciente) {
      throw new NotFoundException(`Paciente com ID ${id} não encontrado.`);
    }
    return paciente;
  }

  // Exclui um paciente pelo ID
  @Public()
  @Delete(':id')
  async deletePaciente(@Param('id', ParseIntPipe) id: number) {
    return this.pacientesService.deletePaciente(id);
  }

  // Atualiza as informações de um paciente pelo ID
  @Public()
  @Patch(':id')
  async updatePaciente(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) data: UpdatePacienteDto,
  ) {
    return this.pacientesService.updatePaciente(id, data);
  }
}
