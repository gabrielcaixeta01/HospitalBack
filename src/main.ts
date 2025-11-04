// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule, OpenAPIObject } from '@nestjs/swagger';
import type { Request, Response, Express } from 'express';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // --- BigInt JSON fix: serializa BigInt como string ---
  Object.defineProperty(BigInt.prototype, 'toJSON', {
    value: function (this: bigint) {
      return this.toString();
    },
    configurable: true,
    writable: true,
  });

  // Se estiver atrás de proxy (Vercel/NGINX/Render), ative para cookies "secure"
  const expressApp = app.getHttpAdapter().getInstance() as Express;
  expressApp.enable('trust proxy');

  // Prefixo de API (defina antes do Swagger para manter rotas sob /api/v1/*)
  app.setGlobalPrefix('api/v1');

  // Cookies (necessário para JWT em cookie httpOnly)
  app.use(cookieParser());

  // CORS (credenciais habilitadas para enviar cookies)
  const frontendOrigin = process.env.FRONTEND_ORIGIN || 'http://localhost:3000';
  app.enableCors({
    origin: frontendOrigin,
    credentials: true,
  });

  // Validação global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Swagger (Bearer no header; se quiser, depois adicionamos cookie auth também)
  const config = new DocumentBuilder()
    .setTitle('Hospital API')
    .setDescription('API do sistema hospitalar')
    .setVersion('1.0')
    .addBearerAuth() // Authorization: Bearer <token>
    .build();

  const document: OpenAPIObject = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1/docs', app, document);
  app.use('/api/v1/docs-json', (_req: Request, res: Response) =>
    res.json(document),
  );

  const port = Number(process.env.PORT) || 4000;
  await app.listen(port);

  console.log(
    `Server started on port ${port} (env=${process.env.NODE_ENV || 'development'})`,
  );
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
