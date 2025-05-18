import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async signup(dto: SignupDto) {
    const validRoles = ['student', 'instructor'];
    if (!validRoles.includes(dto.role)) {
      throw new BadRequestException(
        'Invalid role. Must be student or instructor.',
      );
    }

    const hashed = await bcrypt.hash(dto.password, 10);

    try {
      await this.prisma.user.create({
        data: {
          email: dto.email,
          password: hashed,
          fullName: dto.fullName,
          role: dto.role,
        },
      });

      return { message: 'User registered successfully' };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        const target = (error.meta as any)?.target;
        if (
          (Array.isArray(target) && target.includes('email')) ||
          target === 'User_email_key'
        ) {
          throw new BadRequestException(
            'A user with this email already exists.',
          );
        }
      }

      throw new BadRequestException('Signup failed');
    }
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new BadRequestException('Invalid credentials');
    }

    const token = this.jwt.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      access_token: token,
    };
  }
}
