import {
  INestApplication,
  Injectable,
  NestApplicationOptions,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    const options: NestApplicationOptions = app
      .getHttpAdapter()
      .getInstance()
      .getOptions();

    process.on('beforeExit', async () => {
      await app.close();
    });
  }
}
