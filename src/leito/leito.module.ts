/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { LeitosController } from './leito.controller';
import { LeitoService } from './leito.service';

@Module({
  imports: [PrismaModule],
  controllers: [LeitosController],
  providers: [LeitoService],
  exports: [LeitoService],
})
export class LeitosModule {}