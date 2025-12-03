import {
	Controller,
	Post,
	Body,
	ValidationPipe,
	Get,
	Param,
	ParseIntPipe,
	Patch,
	Delete,
	NotFoundException,
} from '@nestjs/common';
import { PrescricaoService } from './prescricao.service';
import { CreatePrescricaoDto } from './dto/create-prescricao-dto';
import { UpdatePrescricaoDto } from './dto/update-prescricao-dto';

@Controller('prescricoes')
export class PrescricaoController {
	constructor(private readonly prescricaoService: PrescricaoService) {}

	@Post()
	async create(@Body(ValidationPipe) data: CreatePrescricaoDto) {
		return this.prescricaoService.create(data);
	}

	@Get()
	findAll() {
		return this.prescricaoService.findAll();
	}

	@Get(':id')
	async findOne(@Param('id', ParseIntPipe) id: number) {
		const presc = await this.prescricaoService.findOne(id);
		if (!presc) throw new NotFoundException(`Prescrição ${id} não encontrada.`);
		return presc;
	}

	@Patch(':id')
	async update(
		@Param('id', ParseIntPipe) id: number,
		@Body(ValidationPipe) data: UpdatePrescricaoDto,
	) {
		return this.prescricaoService.update(id, data);
	}

	@Delete(':id')
	async remove(@Param('id', ParseIntPipe) id: number) {
		return this.prescricaoService.remove(id);
	}
}
