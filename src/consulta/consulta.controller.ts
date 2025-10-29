import { Public } from 'src/auth/decorators/isPublic.decorator';
import { CreateConsultaDto } from './dto/create-consulta-dto';
import { UpdateConsultaDto } from './dto/update-consulta-dto';
import { ConsultasService } from './consulta.service';
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

@Controller('consultas')
export class ConsultasController {
  constructor(private readonly consultasService: ConsultasService) {}

  // Cria uma consulta
  @Public()
  @Post()
  async create(@Body(ValidationPipe) consultaData: CreateConsultaDto) {
    return this.consultasService.create(consultaData);
  }

  // Retorna todas as consultas
  @Public()
  @Get()
  findAll() {
    return this.consultasService.findAll();
  }

  // Retorna uma consulta específica pelo ID
  @Public()
  @Get(':id')
  async findConsulta(@Param('id', ParseIntPipe) id: number) {
    const consulta = await this.consultasService.findConsulta(id);
    if (!consulta) {
      throw new NotFoundException(`Consulta com ID ${id} não encontrada.`);
    }
    return consulta;
  }

  // Exclui uma consulta pelo ID
  @Public()
  @Delete(':id')
  async deleteConsulta(@Param('id', ParseIntPipe) id: number) {
    return this.consultasService.deleteConsulta(id);
  }

  // Atualiza as informações de uma consulta pelo ID
  @Public()
  @Patch(':id')
  async updateConsulta(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) data: UpdateConsultaDto,
  ) {
    return this.consultasService.updateConsulta(id, data);
  }
}
