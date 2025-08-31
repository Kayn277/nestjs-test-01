import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configDotenv } from 'dotenv';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

// import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
configDotenv();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('NestJS Test API')
    .setDescription('Provides auth and articles description')
    .setVersion('0.1')
    .addTag('articles')
    .addTag('auth')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch((reason: any) => {
  console.error(reason);
});
