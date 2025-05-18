import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { CreateLessonDto } from './dto/create-lesson.dto';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  async createCourse(userId: number, dto: CreateCourseDto) {
    return this.prisma.course.create({
      data: {
        title: dto.title,
        description: dto.description,
        instructorId: userId,
      },
    });
  }

  async addLesson(userId: number, courseId: number, dto: CreateLessonDto) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });
    if (!course) throw new NotFoundException('Course not found');
    if (course.instructorId !== userId)
      throw new ForbiddenException('Not your course');

    return this.prisma.lesson.create({
      data: {
        title: dto.title,
        content: dto.content,
        courseId: courseId,
      },
    });
  }

  async enrollInCourse(userId: number, courseId: number) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });
    if (!course) throw new NotFoundException('Course not found');

    return this.prisma.enrollment.create({
      data: {
        courseId,
        studentId: userId,
      },
    });
  }

  async getLessonsIfEnrolled(userId: number, courseId: number) {
    const enrolled = await this.prisma.enrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId: userId,
          courseId: courseId,
        },
      },
    });

    if (!enrolled)
      throw new ForbiddenException('You are not enrolled in this course');

    return this.prisma.lesson.findMany({
      where: {
        courseId,
      },
    });
  }
}
