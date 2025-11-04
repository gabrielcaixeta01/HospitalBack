/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { LeitosService } from './leitos.service';
import { CreateLeitoDto } from './dto/create-leito-dto';
import { UpdateLeitoDto } from './dto/update-leito-dto';
import { Public } from 'src/auth/decorators/isPublic.decorator';

@Controller('leitos')
export class LeitosController {
  constructor(private readonly service: LeitosService) {}

  @Public()
  @Post()
  create(@Body() dto: CreateLeitoDto) {
    return this.service.create(dto);
  }

  @Public()
  @Get()
  findAll() {
    return this.service.findAll();
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