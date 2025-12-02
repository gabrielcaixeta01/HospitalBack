import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { PrismaModule } from "./prisma/prisma.module";

import { PacientesModule } from "./paciente/paciente.module";
import { MedicosModule } from "./medico/medico.module";
import { EspecialidadesModule } from "./especialidades/especialidades.module";
import { ConsultasModule } from "./consulta/consulta.module";
import { ExameModule } from "./exame/exame.module";
import { InternacoesModule } from "./internacao/internacao.module";
import { LeitosModule } from "./leito/leito.module";
import { ArquivoClinicoModule } from "./arquivo-clinico/arquivo-clinico.module";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";

import { RelatoriosController } from "./relatorios/relatorios.controller";
import { RelatoriosService } from "./relatorios/relatorios.service";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,

    PacientesModule,
    MedicosModule,
    EspecialidadesModule,
    ConsultasModule,
    ExameModule,
    InternacoesModule,
    LeitosModule,
    ArquivoClinicoModule,
  ],
  controllers: [AppController, RelatoriosController],
  providers: [AppService, RelatoriosService],
})
export class AppModule {}
