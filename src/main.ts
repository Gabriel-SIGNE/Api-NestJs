import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    "origin": "*",
    "allowedHeaders": "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization",
    "methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  });
  app.useGlobalPipes(new ValidationPipe({
    whitelist:true,
    forbidNonWhitelisted:true,
    transform:true
  }));
  const config = new DocumentBuilder()
    .setTitle('Stuff example')
    .setDescription('The Stuff API description')
    .setVersion('1.0')
    .addTag('stuffs')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-doc', app, documentFactory);
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
