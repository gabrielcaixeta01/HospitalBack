import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PacientesModule } from './paciente/paciente.module';
import { MedicosModule } from './medico/medico.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule, AuthModule, PacientesModule, MedicosModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
