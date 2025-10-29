import { Module } from '@nestjs/common';
import { PrescricaoController } from './prescricao.controller';
import { PrescricaoService } from './prescricao.service';

@Module({
	controllers: [PrescricaoController],
	providers: [PrescricaoService],
	exports: [PrescricaoService],
})
export class PrescricaoModule {}
