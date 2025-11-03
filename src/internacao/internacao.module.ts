/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { InternacoesController } from './internacao.controller';
import { InternacoesService } from './internacao.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [InternacoesController],
  providers: [InternacoesService],
})
export class InternacoesModule {}