import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { LeitosController } from './leito.controller';

@Module({
  imports: [PrismaModule],
  controllers: [LeitosController],
})
export class LeitosModule {}
