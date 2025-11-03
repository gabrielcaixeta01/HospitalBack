import { Controller, Get } from '@nestjs/common';
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
}
