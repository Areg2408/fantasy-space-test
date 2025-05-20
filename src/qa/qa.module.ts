import { PrismaModule } from '../prisma/prisma.module';
import { QaController } from './qa.controller';
import { Module } from '@nestjs/common';
import { QaService } from './qa.service';
import { QaCron } from './qa.cron';

@Module({
  imports: [PrismaModule],
  controllers: [QaController],
  providers: [QaService, QaCron],
})
export class QaModule {}
