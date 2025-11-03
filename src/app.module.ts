import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PacientesModule } from './paciente/paciente.module';
import { MedicosModule } from './medico/medico.module';
import { PrismaModule } from './prisma/prisma.module';
import { EspecialidadesModule } from './especialidades/especialidades.module';
import { ConsultasModule } from './consulta/consulta.module';
import { InternacoesModule } from './internacao/internacao.module';
import { LeitosModule } from './leito/leitos.module';
import { ExameModule } from './exame/exame.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    PacientesModule,
    MedicosModule,
    EspecialidadesModule,
    ConsultasModule,
    ExameModule,
    InternacoesModule,
    LeitosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
