/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { LeitosController } from './leitos.controller';
import { LeitosService } from './leitos.service';

@Module({
  imports: [PrismaModule],
  controllers: [LeitosController],
  providers: [LeitosService],
  exports: [LeitosService],
})
export class LeitosModule {}