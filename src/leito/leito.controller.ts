/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { LeitoService } from './leito.service';  // <-- IMPORTAÇÃO CORRETA
import { CreateLeitoDto } from './dto/create-leito-dto';
import { UpdateLeitoDto } from './dto/update-leito-dto';

@Controller('leitos')
export class LeitosController {
  constructor(private readonly service: LeitoService) {}  // <-- SERVICE CORRETO

  @Post()
  create(@Body() dto: CreateLeitoDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();  // <-- AGORA CHAMA O findAll COM INTERNACOES
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateLeitoDto) {
    return this.service.update(id, dto);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: 'livre'|'ocupado'|'manutencao',
  ) {
    return this.service.updateStatus(id, status);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}