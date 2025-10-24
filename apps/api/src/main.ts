/* eslint-disable prettier/prettier */

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Configurar archivos estáticos - CRÍTICO para servir imágenes
  app.useStaticAssets(join(__dirname, '..', 'public'), {
    prefix: '/public/',
  });

  // Habilitar CORS para permitir peticiones desde el frontend
  app.enableCors({
    origin: '*',
    credentials: true,
  });
  
  const config = new DocumentBuilder()
    .setTitle("API de Gestión de Usuarios")
    .setDescription("API para gestionar usuarios con autenticación JWT")
    .setVersion("1.0")
    .addBearerAuth() // Añadir esta línea para habilitar la autenticación Bearer en Swagger UI
    .build();
  const doc = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, doc);
  await app.listen(3000, '0.0.0.0');
}
bootstrap();
