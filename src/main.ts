import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  Object.defineProperty(BigInt.prototype, 'toJSON', {
    value: function (this: bigint) {
      return this.toString();
    },
  });

  app.enableCors({
    origin: "*",
    methods: "GET,POST,PATCH,DELETE,PUT,OPTIONS",
    allowedHeaders: "*",
  });

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  await app.listen(process.env.PORT || 4000);
  console.log("BACKEND ON: http://localhost:4000/api/v1");
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});