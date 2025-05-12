// src/main.ts

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CustomValidationPipeOptions } from './config/validation-ppe-options.config';
import { FilterPipe } from './shared/pipes/filter.pipe';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { useContainer } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: true,
  });
  const config = app.get(ConfigService);

  app.enableCors({
    origin:
      config.get<string>('NODE_ENV') === 'production'
        ? config.get('ALLOWED_ORIGINS')
        : true,
    methods: 'GET,POST,PATCH,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true, // allow cookies/auth headers
  });

  // set global prefix
  app.setGlobalPrefix(config.get('app.globalPrefix'));

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Demo')
    .setDescription('Demo api description')
    .setVersion('1.0')
    .addServer(config.get<string>('app.baseUrl'))
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'Authorization',
    )
    .build();

  const documentFactory = () =>
    SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api-docs', app, documentFactory);

  app.use(cookieParser());

  app.use(helmet());

  app.useGlobalPipes(
    new FilterPipe(),
    new ValidationPipe(CustomValidationPipeOptions),
  );

  // this tells class validator to use nestjs DI Container
  useContainer(app.select(AppModule), { fallbackOnErrors: true}) // this fixes the validator dependency injecting issue

  const PORT = process.env.PORT || 3000;
  await app.listen(PORT);
}
bootstrap();
