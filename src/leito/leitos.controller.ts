/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Post } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Public } from 'src/auth/decorators/isPublic.decorator';

@Controller('leitos')
export class LeitosController {
  constructor(private readonly prisma: PrismaService) {}

  @Public()
  @Get()
  findAll() {
    return this.prisma.leito.findMany({
      orderBy: { id: 'asc' },
      select: { id: true, codigo: true, status: true },
    });
  }

  @Public()
  @Post()
  create(@Body() data: { codigo: string; status?: string }) {
    const createData = {
      codigo: data.codigo,
      status: data.status ?? 'available',
    };
    return this.prisma.leito.create({ data: createData });
  }
}