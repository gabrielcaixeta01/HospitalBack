import { Module } from '@nestjs/common';
import { ExamesService } from './exame.service';
import { ExamesController } from './exame.controller';

@Module({
  controllers: [ExamesController],
  providers: [ExamesService],
})
export class ExamesModule {}
