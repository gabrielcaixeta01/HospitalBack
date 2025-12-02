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
  UsePipes,
} from '@nestjs/common';

import { MedicosService } from './medico.service';
import { CreateMedicoDto } from './dto/create-medico-dto';
import { UpdateMedicoDto } from './dto/update-medico-dto';

@Controller('medicos')
export class MedicosController {
  constructor(private readonly medicosService: MedicosService) {}

  @Post()
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  )
  async create(@Body() medicoData: CreateMedicoDto) {
    return this.medicosService.create(medicoData);
  }

  @Get()
  async findAll() {
    return this.medicosService.findAll();
  }

  @Get(':id')
  async findMedico(@Param('id', ParseIntPipe) id: number) {
    return this.medicosService.findOne(id);
  }

  @Delete(':id')
  async deleteMedico(@Param('id', ParseIntPipe) id: number) {
    return this.medicosService.delete(id);
  }

  @Patch(':id')
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  )
  async updateMedico(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateMedicoDto,
  ) {
    return this.medicosService.update(id, data);
  }
}