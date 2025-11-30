import { CreateMedicoDto } from './dto/create-medico-dto';
import { UpdateMedicoDto } from './dto/update-medico-dto';
import { MedicosService } from './medico.service';
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

@Controller('medicos')
export class MedicosController {
  constructor(private readonly medicosService: MedicosService) {}

  @Post()
  async create(@Body(ValidationPipe) medicoData: CreateMedicoDto) {
    return this.medicosService.create(medicoData);
  }

  @Get()
  findAll() {
    return this.medicosService.findAll();
  }

  @Get(':id')
  async findMedico(@Param('id', ParseIntPipe) id: number) {
    const medico = await this.medicosService.findMedico(id);
    if (!medico) {
      throw new NotFoundException(`Médico com ID ${id} não encontrado.`);
    }
    return medico;
  }

  @Delete(':id')
  async deleteMedico(@Param('id', ParseIntPipe) id: number) {
    return this.medicosService.deleteMedico(id);
  }

  @Patch(':id')
  async updateMedico(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) data: UpdateMedicoDto,
  ) {
    return this.medicosService.updateMedico(id, data);
  }
}
