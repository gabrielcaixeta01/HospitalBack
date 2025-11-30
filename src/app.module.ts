/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PacientesModule } from './paciente/paciente.module';
import { MedicosModule } from './medico/medico.module';
import { PrismaModule } from './prisma/prisma.module';
import { EspecialidadesModule } from './especialidades/especialidades.module';
import { ConsultasModule } from './consulta/consulta.module';
import { InternacoesModule } from './internacao/internacao.module';
import { LeitosModule } from './leito/leito.module';
import { ExameModule } from './exame/exame.module';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
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
  providers: [AppService],
  
})
export class AppModule {}
