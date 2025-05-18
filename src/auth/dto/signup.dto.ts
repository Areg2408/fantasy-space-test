import { IsEmail, IsNotEmpty, MinLength, IsEnum } from 'class-validator';

export enum Role {
  student = 'student',
  instructor = 'instructor',
}

export class SignupDto {
  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  @IsNotEmpty()
  fullName: string;

  @IsEnum(Role, { message: 'Role must be either student or instructor' })
  role: Role;
}
