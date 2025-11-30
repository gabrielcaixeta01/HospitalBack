import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { MedicoEspecialidadeService } from './medico-especialidade.service';
import { LinkMedicoEspecialidadeDto } from './dto/link-medico-especialidade.dto';

@Controller('medicos')
export class MedicoEspecialidadeController {
  constructor(private readonly service: MedicoEspecialidadeService) {}

  @Post(':medicoId/especialidades')
  add(
    @Param('medicoId') medicoIdParam: string,
    @Body() dto: LinkMedicoEspecialidadeDto,
  ) {
    const medicoId = BigInt(medicoIdParam);
    return this.service.addEspecialidades(medicoId, dto.especialidadeIds);
  }

  @Delete(':medicoId/especialidades/:especialidadeId')
  remove(
    @Param('medicoId') medicoIdParam: string,
    @Param('especialidadeId', ParseIntPipe) especialidadeId: number,
  ) {
    const medicoId = BigInt(medicoIdParam);
    return this.service.removeEspecialidade(medicoId, especialidadeId);
  }
}
