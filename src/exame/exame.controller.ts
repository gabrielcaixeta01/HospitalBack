import { Public } from 'src/auth/decorators/isPublic.decorator';
import { CreateExameDto } from './dto/create-exame-dto';
import { UpdateExameDto } from './dto/update-exame-dto';
import { ExamesService } from './exame.service';
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

@Controller('exames')
export class ExamesController {
  constructor(private readonly examesService: ExamesService) {}

  // Cria um exame
  @Public()
  @Post()
  async create(@Body(ValidationPipe) exameData: CreateExameDto) {
    return this.examesService.create(exameData);
  }

  // Retorna todos os exames
  @Public()
  @Get()
  findAll() {
    return this.examesService.findAll();
  }

  // Retorna um exame específico pelo ID
  @Public()
  @Get(':id')
  async findExame(@Param('id', ParseIntPipe) id: number) {
    const exame = await this.examesService.findExame(id);
    if (!exame) {
      throw new NotFoundException(`Exame com ID ${id} não encontrado.`);
    }
    return exame;
  }

  // Exclui um exame pelo ID
  @Public()
  @Delete(':id')
  async deleteExame(@Param('id', ParseIntPipe) id: number) {
    return this.examesService.deleteExame(id);
  }

  // Atualiza as informações de um exame pelo ID
  @Public()
  @Patch(':id')
  async updateExame(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) data: UpdateExameDto,
  ) {
    return this.examesService.updateExame(id, data);
  }
}
