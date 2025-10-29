import { Public } from 'src/auth/decorators/isPublic.decorator';
import { CreateEspecialidadeDto } from './dto/create-especialidade-dto';
import { UpdateEspecialidadeDto } from './dto/update-especialidade-dto';
import { EspecialidadesService } from './especialidade.service';
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

@Controller('especialidades')
export class EspecialidadesController {
  constructor(private readonly especialidadesService: EspecialidadesService) {}

  // Cria uma especialidade
  @Public()
  @Post()
  async create(
    @Body(ValidationPipe) especialidadeData: CreateEspecialidadeDto,
  ) {
    return this.especialidadesService.create(especialidadeData);
  }

  // Retorna todas as especialidades
  @Public()
  @Get()
  findAll() {
    return this.especialidadesService.findAll();
  }

  // Retorna uma especialidade específica pelo ID
  @Public()
  @Get(':id')
  async findEspecialidade(@Param('id', ParseIntPipe) id: number) {
    const especialidade =
      await this.especialidadesService.findEspecialidade(id);
    if (!especialidade) {
      throw new NotFoundException(`Especialidade com ID ${id} não encontrada.`);
    }
    return especialidade;
  }

  // Exclui uma especialidade pelo ID
  @Public()
  @Delete(':id')
  async deleteEspecialidade(@Param('id', ParseIntPipe) id: number) {
    return this.especialidadesService.deleteEspecialidade(id);
  }

  // Atualiza as informações de uma especialidade pelo ID
  @Public()
  @Patch(':id')
  async updateEspecialidade(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) data: UpdateEspecialidadeDto,
  ) {
    return this.especialidadesService.updateEspecialidade(id, data);
  }
}
