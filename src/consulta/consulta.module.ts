import { Module } from '@nestjs/common';
import { ConsultasController } from './consulta.controller';
import { ConsultasService } from './consulta.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrescricaoModule } from 'src/prescricao/prescricao.module';

@Module({
  imports: [PrismaModule, PrescricaoModule],
  controllers: [ConsultasController],
  providers: [ConsultasService],
})
export class ConsultasModule {}
