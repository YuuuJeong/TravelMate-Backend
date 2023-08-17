import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api', {
    exclude: ['/'],
  });
  const port = app.get<ConfigService>(ConfigService).get('SERVER_PORT');
  console.log(port);
  await app.listen(port);
}
bootstrap();
