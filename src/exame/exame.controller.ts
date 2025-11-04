/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  ParseIntPipe,
  Patch,
  Delete,
  ValidationPipe,
} from '@nestjs/common';
import { ExameService } from './exame.service';
import { CreateExameDto } from './dto/create-exame-dto';
import { UpdateExameDto } from './dto/update-exame-dto';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('exames')
export class ExameController {
  constructor(private readonly service: ExameService) {}

  @Public()
  @Post()
  create(@Body(ValidationPipe) body: CreateExameDto) {
    return this.service.create(body);
  }

  @Public()
  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Public()
  @Get('pendentes/count')
  countPendentes() {
    return this.service.countPendentes();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Public()
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) body: UpdateExameDto,
  ) {
    return this.service.update(id, body);
  }

  @Public()
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}