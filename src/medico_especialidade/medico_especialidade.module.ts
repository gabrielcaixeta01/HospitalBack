import { Module } from '@nestjs/common';
import { MedicoEspecialidadeController } from './medico_especialidade.controller';
import { MedicoEspecialidadeService } from './medico_especialidade.service';

@Module({
	controllers: [MedicoEspecialidadeController],
	providers: [MedicoEspecialidadeService],
	exports: [MedicoEspecialidadeService],
})
export class MedicoEspecialidadeModule {}
