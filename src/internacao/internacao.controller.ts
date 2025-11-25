/* eslint-disable prettier/prettier */
import {
  Body, Controller, Get, Post, Patch, Delete,
  Param, ParseIntPipe, ValidationPipe,
} from '@nestjs/common';
import { Public } from 'src/auth/decorators/public.decorator';
import { InternacoesService } from './internacao.service';
import { CreateInternacaoDto } from './dto/create-internacao-dto';
import { UpdateInternacaoDto } from './dto/update-internacao-dto';

@Controller('internacoes')
export class InternacoesController {
  constructor(private readonly service: InternacoesService) {}

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
  @Post()
  create(@Body(ValidationPipe) dto: CreateInternacaoDto) {
    return this.service.create({ ...dto, dataEntrada: new Date(dto.dataEntrada) });
  }

  @Public()
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) dto: UpdateInternacaoDto,
  ) {
    return this.service.update(id, dto);
  }

  @Public()
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}