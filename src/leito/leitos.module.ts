/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { LeitosController } from './leitos.controller';

@Module({
  imports: [PrismaModule],
  controllers: [LeitosController],
})
export class LeitosModule {}