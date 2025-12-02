import { Module } from "@nestjs/common";
import { ArquivoClinicoController } from "./arquivo-clinico.controller";
import { ArquivoClinicoService } from "./arquivo-clinico.service";
import { PrismaModule } from "src/prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [ArquivoClinicoController],
  providers: [ArquivoClinicoService],
})
export class ArquivoClinicoModule {}
