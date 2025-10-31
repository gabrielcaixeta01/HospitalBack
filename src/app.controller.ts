import { Module, Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PacientesModule } from './paciente/paciente.module';
import { MedicosModule } from './medico/medico.module';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
}

@Module({
  imports: [
    AuthModule,
    PacientesModule,
    MedicosModule, // importa o módulo de médicos
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
