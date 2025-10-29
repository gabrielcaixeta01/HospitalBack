import { Module } from '@nestjs/common';
import { InternacoesService } from './internacao.service';
import { InternacoesController } from './internacao.controller';

@Module({
  controllers: [InternacoesController],
  providers: [InternacoesService],
})
export class InternacoesModule {}
