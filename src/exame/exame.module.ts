/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ExameService } from './exame.service';
import { ExameController } from './exame.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ExameController],
  providers: [ExameService],
  exports: [ExameService],
})
export class ExameModule {}