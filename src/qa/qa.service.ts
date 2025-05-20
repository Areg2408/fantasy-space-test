// qa.service.ts
import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AskQuestionDto } from './dto/ask-question.dto';
import { AnswerQuestionDto } from './dto/answer-question.dto';

@Injectable()
export class QaService {
  constructor(private prisma: PrismaService) {}

  async askQuestion(userId: number, lessonId: number, dto: AskQuestionDto) {
    return this.prisma.question.create({
      data: {
        content: dto.content,
        lessonId,
        studentId: userId,
      },
    });
  }

  async answerQuestion(
    instructorId: number,
    questionId: number,
    dto: AnswerQuestionDto,
  ) {
    const question = await this.prisma.question.findUnique({
      where: { id: questionId },
      include: { lesson: { include: { course: true } } },
    });

    if (!question || question.lesson.course.instructorId !== instructorId) {
      throw new ForbiddenException('Not authorized to answer this question');
    }

    return this.prisma.question.update({
      where: { id: questionId },
      data: {
        answer: dto.answer,
      },
    });
  }

  async deleteOldUnansweredQuestions() {
    const threshold = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    return this.prisma.question.deleteMany({
      where: {
        answer: null,
        createdAt: { lt: threshold },
      },
    });
  }
}
