import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePrescricaoDto } from './dto/create-prescricao-dto';
import { UpdatePrescricaoDto } from './dto/update-prescricao-dto';

@Injectable()
export class PrescricaoService {
	constructor(private readonly prisma: PrismaService) {}

	async create(data: CreatePrescricaoDto) {
		const consulta = await this.prisma.consulta.findUnique({ where: { id: Number(data.consultaId) }, select: { id: true } });
		if (!consulta) throw new BadRequestException('Consulta inexistente para consultaId informado.');

		return this.prisma.prescricao.create({
			data: {
				consultaId: Number(data.consultaId),
				texto: data.texto,
			},
		});
	}

	async findAll() {
		return this.prisma.prescricao.findMany({
			orderBy: { id: 'asc' },
			include: {
				consulta: {
					select: {
						id: true,
						dataHora: true,
						paciente: { select: { id: true, nome: true } },
						medico: { select: { id: true, nome: true } },
					},
				},
			},
		});
	}

	async findOne(id: number) {
		const presc = await this.prisma.prescricao.findUnique({
			where: { id },
			include: {
				consulta: {
					select: {
						id: true,
						dataHora: true,
						paciente: { select: { id: true, nome: true } },
						medico: { select: { id: true, nome: true } },
					},
				},
			},
		});
		if (!presc) throw new NotFoundException(`Prescrição ${id} não encontrada.`);
		return presc;
	}

	async update(id: number, data: UpdatePrescricaoDto) {
		if (data.consultaId != null) {
			const exists = await this.prisma.consulta.findUnique({ where: { id: Number(data.consultaId) }, select: { id: true } });
			if (!exists) throw new BadRequestException('consultaId informado não existe.');
		}

		return this.prisma.prescricao.update({
			where: { id },
			data: {
				...(data.texto !== undefined ? { texto: data.texto } : {}),
				...(data.consultaId !== undefined ? { consultaId: Number(data.consultaId) } : {}),
			},
			include: {
				consulta: {
					select: {
						id: true,
						dataHora: true,
						paciente: { select: { id: true, nome: true } },
						medico: { select: { id: true, nome: true } },
					},
				},
			},
		});
	}

	async remove(id: number) {
		const found = await this.prisma.prescricao.findUnique({ where: { id } });
		if (!found) throw new NotFoundException(`Prescrição ${id} não encontrada.`);

		await this.prisma.prescricao.delete({ where: { id } });
		return { ok: true };
	}
}
