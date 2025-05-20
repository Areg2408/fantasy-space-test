import { Test, TestingModule } from '@nestjs/testing';
import { CoursesService } from './courses.service';
import { PrismaService } from '../prisma/prisma.service';

const mockPrismaService = {
  course: {
    create: jest.fn(),
  },
};

describe('CoursesService', () => {
  let service: CoursesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoursesService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<CoursesService>(CoursesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a course', async () => {
    const mockCourse = { id: 1, title: 'Test Course' };
    mockPrismaService.course.create.mockResolvedValue(mockCourse);

    const result = await service.createCourse(1, {
      title: 'Test Course',
      description: 'A course',
      level: 'BEGINNER',
    });

    expect(result).toEqual(mockCourse);
    expect(mockPrismaService.course.create).toHaveBeenCalledWith({
      data: {
        title: 'Test Course',
        description: 'A course',
        level: 'BEGINNER',
        instructorId: 1,
      },
    });
  });
});
