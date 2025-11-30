import { Module } from '@nestjs/common';
import { ConsultasController } from './consulta.controller';
import { ConsultasService } from './consulta.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ConsultasController],
  providers: [ConsultasService],
})
export class ConsultasModule {}
