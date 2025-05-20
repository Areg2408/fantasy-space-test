import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  UseGuards,
  Req,
  ParseIntPipe,
  UseInterceptors,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateCourseDto } from './dto/create-course.dto';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';

@Controller('courses')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  @Roles(Role.instructor)
  create(@Body() dto: CreateCourseDto, @Req() req) {
    return this.coursesService.createCourse(req.user.userId, dto);
  }

  @Post(':id/lessons')
  @Roles(Role.instructor)
  addLesson(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateLessonDto,
    @Req() req,
  ) {
    return this.coursesService.addLesson(req.user.userId, id, dto);
  }

  @Post(':id/enroll')
  @Roles(Role.student)
  enroll(@Param('id', ParseIntPipe) id: number, @Req() req) {
    return this.coursesService.enrollInCourse(req.user.userId, id);
  }

  @Get(':id/lessons')
  @Roles(Role.student)
  @UseInterceptors(CacheInterceptor)
  @CacheKey('course_lessons') // Optional, use static key or customize
  @CacheTTL(60) // Optional, cache for 60 seconds
  getLessons(@Param('id', ParseIntPipe) id: number, @Req() req) {
    return this.coursesService.getLessonsIfEnrolled(req.user.userId, id);
  }
}
