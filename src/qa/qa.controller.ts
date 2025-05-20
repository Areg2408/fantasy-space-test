// qa.controller.ts
import { Body, Controller, Param, ParseIntPipe, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { QaService } from './qa.service';
import { Role } from '../auth/dto/signup.dto';
import { AskQuestionDto } from './dto/ask-question.dto';
import { AnswerQuestionDto } from './dto/answer-question.dto';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
export class QaController {
  constructor(private readonly qaService: QaService) {}

  @Post('lessons/:id/questions')
  @Roles(Role.student)
  ask(@Param('id', ParseIntPipe) id: number, @Body() dto: AskQuestionDto, @Req() req) {
    return this.qaService.askQuestion(req.user.userId, id, dto);
  }

  @Post('questions/:id/answer')
  @Roles(Role.instructor)
  answer(@Param('id', ParseIntPipe) id: number, @Body() dto: AnswerQuestionDto, @Req() req) {
    return this.qaService.answerQuestion(req.user.userId, id, dto);
  }
}
