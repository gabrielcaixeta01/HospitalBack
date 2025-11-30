/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MedicoEspecialidadeService } from './medico-especialidade.service';
import { MedicoEspecialidadeController } from './medico-especialidade.controler';

@Module({
  imports: [PrismaModule],
  providers: [MedicoEspecialidadeService],
  controllers: [MedicoEspecialidadeController],
})
export class MedicoEspecialidadeModule {}
