import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule, OpenAPIObject } from '@nestjs/swagger';
import { Request, Response } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // --- BigInt JSON fix: serializa BigInt como string ---
  (
    BigInt.prototype as unknown as { toJSON?: (this: bigint) => string }
  ).toJSON = function (this: bigint) {
    return this.toString();
  };

  // CORS: allow frontend dev origin by default, enable credentials for cookie-based auth
  const frontendOrigin = process.env.FRONTEND_ORIGIN || 'http://localhost:3000';
  app.enableCors({ origin: frontendOrigin, credentials: true });

  // Global validation pipe: whitelist unknown properties and transform payloads to DTO instances
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true }, // útil p/ datas e números
    }),
  );

  // OpenAPI / Swagger
  const config = new DocumentBuilder()
    .setTitle('Hospital API')
    .setDescription('API do sistema hospitalar')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document: OpenAPIObject = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1/docs', app, document);
  app.use('/api/v1/docs-json', (_req: Request, res: Response) =>
    res.json(document),
  );

  // API prefix (versioning via prefix)
  app.setGlobalPrefix('api/v1');

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
