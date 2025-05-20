import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  // Optional helper if you want to clean DB during e2e tests
  cleanDatabase() {
    return this.$transaction([
      this.user.deleteMany(),
      // Add other models here if needed
    ]);
  }
}
