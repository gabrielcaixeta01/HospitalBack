import { Module } from '@nestjs/common';
import { ConsultasService } from './consulta.service';
import { ConsultasController } from './consulta.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ConsultasController],
  providers: [ConsultasService],
  exports: [ConsultasService],
})
export class ConsultasModule {}
