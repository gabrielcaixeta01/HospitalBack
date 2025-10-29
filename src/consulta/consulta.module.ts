import { Module } from '@nestjs/common';
import { ConsultasService } from './consulta.service';
import { ConsultasController } from './consulta.controller';

@Module({
  controllers: [ConsultasController],
  providers: [ConsultasService],
})
export class ConsultasModule {}
