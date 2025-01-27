import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ClasseService } from 'src/classes/classes.service';
import { JwtService } from '@nestjs/jwt';
import { PerformanceService } from 'src/performance/performance.service';
import { jwtConstants } from './constants';


@Injectable()
export class AuthService {
    constructor(
        private readonly classesService: ClasseService,
        private readonly performanceService: PerformanceService,
        private jwtService: JwtService
    ) {}

  async signIn(teacherID: number, pass: string): Promise<any> {
    const user = await this.classesService.findTeacherById(teacherID);
    if (user?.password !== pass) {
      throw new UnauthorizedException("Password incorrect");
    }
    const payload = { sub: user.teacherID, username: user.teacherName };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signUp (teacherName: string, pass: string): Promise<any> {
    const teacher = await this.classesService.newTeacher(teacherName,pass); 
    if (teacher){
      const payload = { sub: teacher.teacherID, username: teacher.teacherName };
    return {
      access_token: await this.jwtService.signAsync(payload),
      teacherID: teacher.teacherID
    };
    }
  }

  async signInAdmin (password: string): Promise <any> {
    if (jwtConstants.password !== password) {
      throw new UnauthorizedException("Password of admin incorrect");
    }
    const payload = { role: 'admin', password};
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async validateAccessTeacher(userId: number, resourceType: string, resourceId: number): Promise<boolean> {
    switch (resourceType) {
      case 'class':
        return this.validateClassAccess(userId, resourceId);
      case 'assignedTask':
        return this.validateAssignmentAccess(userId, resourceId);
      case 'teacher': 
        return userId === resourceId; 
      default:
        return false;
    }
  }

  private async validateClassAccess(userId: number, classId: number): Promise<boolean> {
    const classData = await this.classesService.findClassById(classId);
    return classData?.teacherID === userId;
  }

  private async validateAssignmentAccess (userId: number, taskId: number): Promise<boolean> {
    const taskData = await this.performanceService.findAssignedTask(taskId); 
    return taskData?.class?.teacherID === userId; 
  }


}
