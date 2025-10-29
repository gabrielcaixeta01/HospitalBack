import { Module } from '@nestjs/common';
import { LeitoController } from './leito.controller';
import { LeitoService } from './leito.service';

@Module({
  controllers: [LeitoController],
  providers: [LeitoService],
  exports: [LeitoService],
})
export class LeitoModule {}
