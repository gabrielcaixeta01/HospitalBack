import { Public } from 'src/auth/decorators/isPublic.decorator';
import { CreateInternacaoDto } from './dto/create-internacao-dto';
import { UpdateInternacaoDto } from './dto/update-internacao-dto';
import { InternacoesService } from './internacao.service';
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

@Controller('internacoes')
export class InternacoesController {
  constructor(private readonly internacoesService: InternacoesService) {}

  // Cria uma internação
  @Public()
  @Post()
  async create(@Body(ValidationPipe) internacaoData: CreateInternacaoDto) {
    return this.internacoesService.create(internacaoData);
  }

  // Retorna todas as internações
  @Public()
  @Get()
  findAll() {
    return this.internacoesService.findAll();
  }

  // Retorna uma internação específica pelo ID
  @Public()
  @Get(':id')
  async findInternacao(@Param('id', ParseIntPipe) id: number) {
    const internacao = await this.internacoesService.findInternacao(id);
    if (!internacao) {
      throw new NotFoundException(`Internação com ID ${id} não encontrada.`);
    }
    return internacao;
  }

  // Exclui uma internação pelo ID
  @Public()
  @Delete(':id')
  async deleteInternacao(@Param('id', ParseIntPipe) id: number) {
    return this.internacoesService.deleteInternacao(id);
  }

  // Atualiza as informações de uma internação pelo ID
  @Public()
  @Patch(':id')
  async updateInternacao(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) data: UpdateInternacaoDto,
  ) {
    return this.internacoesService.updateInternacao(id, data);
  }
}
