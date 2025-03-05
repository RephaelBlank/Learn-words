import { Body, Controller, Post, HttpCode, HttpStatus, UseGuards, Get, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { RolesGuard } from './roles.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: Record<string, any>) {
    return this.authService.signIn(signInDto.teacherEmail, signInDto.password);
  }

  @HttpCode(HttpStatus.OK)
  @Post('sign-up')
  signUp(@Body() signUpDto: Record<string, any>) {
    return this.authService.signUp(signUpDto.teacherName,signUpDto.email, signUpDto.password);
  }

  @HttpCode(HttpStatus.OK)
  @Post('students-login')
  signInStudent(@Body() signInDto: Record<string, any>) {
    return this.authService.signInStudent(signInDto.studentID, signInDto.password);
  }

  @HttpCode(HttpStatus.OK)
  @Post('admin')
  signInAdmin(@Body() signInDto: Record<string, any>) {
    return this.authService.signInAdmin(signInDto.password);
  }

  @UseGuards (AuthGuard,RolesGuard)
  @HttpCode(HttpStatus.OK)
  @Get('assignedTask/:assignedID')
  getTokenToStudents(@Request () req) {
    return this.authService.getTokenToStudents(req.params?.assignedID);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request () req){
    return req.user; 
  }
}