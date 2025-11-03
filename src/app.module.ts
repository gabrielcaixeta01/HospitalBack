import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PacientesModule } from './paciente/paciente.module';
import { MedicosModule } from './medico/medico.module';
import { PrismaModule } from './prisma/prisma.module';
import { EspecialidadesModule } from './especialidades/especialidades.module';
import { ConsultasModule } from './consulta/consulta.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    PacientesModule,
    MedicosModule,
    EspecialidadesModule,
    ConsultasModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
