/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { PacientesService } from './paciente.service';
import { PacientesController } from './paciente.controller';

@Module({
  controllers: [PacientesController],
  providers: [PacientesService],
  exports: [PacientesService],
})
export class PacientesModule {}
