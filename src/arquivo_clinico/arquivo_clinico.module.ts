import { Module } from '@nestjs/common';
import { ArquivoClinicoController } from './arquivo_clinico.controller';
import { ArquivoClinicoService } from './arquivo_clinico.service';

@Module({
	controllers: [ArquivoClinicoController],
	providers: [ArquivoClinicoService],
	exports: [ArquivoClinicoService],
})
export class ArquivoClinicoModule {}
