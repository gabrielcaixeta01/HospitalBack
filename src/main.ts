import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule, OpenAPIObject } from '@nestjs/swagger';
import { Request, Response } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS: allow frontend dev origin by default, enable credentials for cookie-based auth
  const frontendOrigin = process.env.FRONTEND_ORIGIN || 'http://localhost:3000';
  app.enableCors({ origin: frontendOrigin, credentials: true });

  // Global validation pipe: whitelist unknown properties and transform payloads to DTO instances
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  const config = new DocumentBuilder()
    .setTitle('Hospital API')
    .setDescription('API do sistema hospitalar')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document: OpenAPIObject = SwaggerModule.createDocument(app, config);
  // Serve Swagger UI and JSON under the API prefix
  SwaggerModule.setup('api/v1/docs', app, document);
  app.use('/api/v1/docs-json', (_req: Request, res: Response) =>
    res.json(document),
  );
  // Set API prefix (versioning)
  app.setGlobalPrefix('api/v1');
  app.setGlobalPrefix('api/v1');

  await app.listen(process.env.PORT || 3000);
}
bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
