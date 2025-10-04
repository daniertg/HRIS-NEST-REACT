import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Tambahkan ValidationPipe agar semua input dicek otomatis
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // ✅ Aktifkan CORS kalau frontend React akan akses API
  app.enableCors();

  const port = process.env.APP_PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Server running on http://localhost:${port}`);
}
bootstrap();
