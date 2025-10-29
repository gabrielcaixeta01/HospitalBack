import { Module } from '@nestjs/common';
import { EspecialidadesService } from './especialidade.service';
import { EspecialidadesController } from './especialidade.controller';

@Module({
  controllers: [EspecialidadesController],
  providers: [EspecialidadesService],
})
export class EspecialidadesModule {}
