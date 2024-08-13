import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    "origin": "*",
    "allowedHeaders": "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization",
    "methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  });
  await app.listen(3000);
}
bootstrap();
