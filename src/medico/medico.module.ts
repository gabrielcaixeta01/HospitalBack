/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MedicosService } from './medico.service';
import { MedicosController } from './medico.controller';

@Module({
  controllers: [MedicosController],
  providers: [MedicosService],
  exports: [MedicosService],
})
export class MedicosModule {}
