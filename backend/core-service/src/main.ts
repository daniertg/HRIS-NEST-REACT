import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

app.useGlobalPipes(new ValidationPipe());

  app.enableCors({
    origin: '*', // nanti ubah ke domain React kamu misalnya 'http://localhost:5173'
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  const port = process.env.APP_PORT || 3001;

  await app.listen(port);
  console.log(`🚀 Server running on http://localhost:${port}`);
}
process.env.TZ = 'Asia/Jakarta';
bootstrap();
