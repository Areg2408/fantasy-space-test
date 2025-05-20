import { QaService } from './qa.service';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class QaCron {
  constructor(private qaService: QaService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  handleCron() {
    return this.qaService.deleteOldUnansweredQuestions();
  }
}
