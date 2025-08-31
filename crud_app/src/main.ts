import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configDotenv } from 'dotenv';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { PasswordInterceptor } from './interceptors/password.interceptor';

// import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
configDotenv();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('NestJS Test API')
    .setDescription('Provides auth and articles description')
    .setVersion('0.1')
    .addTag('Articles')
    .addTag('User')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, documentFactory);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  app.useGlobalInterceptors(new PasswordInterceptor());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch((reason: any) => {
  console.error(reason);
});
