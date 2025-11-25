/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { LeitoService } from './leito.service';  // <-- IMPORTAÇÃO CORRETA
import { CreateLeitoDto } from './dto/create-leito-dto';
import { UpdateLeitoDto } from './dto/update-leito-dto';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('leitos')
export class LeitosController {
  constructor(private readonly service: LeitoService) {}  // <-- SERVICE CORRETO

  @Public()
  @Post()
  create(@Body() dto: CreateLeitoDto) {
    return this.service.create(dto);
  }

  @Public()
  @Get()
  findAll() {
    return this.service.findAll();  // <-- AGORA CHAMA O findAll COM INTERNACOES
  }

  @Public()
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Public()
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateLeitoDto) {
    return this.service.update(id, dto);
  }

  @Public()
  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: 'livre'|'ocupado'|'manutencao',
  ) {
    return this.service.updateStatus(id, status);
  }

  @Public()
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}