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

  // POST /medicos/:medicoId/especialidades
  @Post(':medicoId/especialidades')
  add(
    @Param('medicoId') medicoIdParam: string,
    @Body() dto: LinkMedicoEspecialidadeDto,
  ) {
    const medicoId = BigInt(medicoIdParam); // seu ID é BigInt
    return this.service.addEspecialidades(medicoId, dto.especialidadeIds);
  }

  // DELETE /medicos/:medicoId/especialidades/:especialidadeId
  @Delete(':medicoId/especialidades/:especialidadeId')
  remove(
    @Param('medicoId') medicoIdParam: string,
    @Param('especialidadeId', ParseIntPipe) especialidadeId: number,
  ) {
    const medicoId = BigInt(medicoIdParam);
    return this.service.removeEspecialidade(medicoId, especialidadeId);
  }
}
