import {Controller, Get, Post, Body, Patch, Param,  Delete, ParseIntPipe,  UsePipes, ValidationPipe } from '@nestjs/common';
import { ConsultasService } from './consulta.service';
import { CreateConsultaDto } from './dto/create-consulta-dto';
import { UpdateConsultaDto } from './dto/update-consulta-dto';
import { RegistrarConsultaVerificadaDto } from './dto/registrar-consulta-verificada.dto';

@Controller('consultas')
export class ConsultasController {
  constructor(private readonly consultasService: ConsultasService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() dto: CreateConsultaDto) {
    return this.consultasService.create(dto);
  }

  @Get()
  findAll() {
    return this.consultasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.consultasService.findOne(id);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateConsultaDto,
  ) {
    return this.consultasService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.consultasService.remove(id);
  }

  // procedure da suzana
  @Post('registrar-verificada')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async registrar(@Body() dto: RegistrarConsultaVerificadaDto) {
    return this.consultasService.registrarConsultaVerificada(dto);
  }

  
}