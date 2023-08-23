import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import basicAuth from 'express-basic-auth';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api', {
    exclude: ['/'],
  });

  const user = app.get<ConfigService>(ConfigService).get('SWAGGER_USER');
  const pw = app.get<ConfigService>(ConfigService).get('SWAGGER_PASSWORD');
  app.use(
    ['/api/docs'],
    basicAuth({
      challenge: true,
      users: {
        [user]: pw,
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('TravelMate Swagger')
    .setDescription('캡스톤 디자인 TravelMate BE 스웨거입니다.')
    .setVersion('1.0.0')
    .addTag('swagger')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  const port = app.get<ConfigService>(ConfigService).get('SERVER_PORT');

  await app.listen(port);
}
bootstrap();
