import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ClasseService } from 'src/classes/classes.service';
import { JwtService } from '@nestjs/jwt';
import { PerformanceService } from 'src/performance/performance.service';
import { jwtConstants } from './constants';
import * as bcrypt from 'bcrypt'; 


@Injectable()
export class AuthService {
    constructor(
        private readonly classesService: ClasseService,
        private readonly performanceService: PerformanceService,
        private jwtService: JwtService
    ) {}

  async signIn(email: string, pass: string): Promise<any> {
    const user = await this.classesService.findTeacherByEmail(email);
    if (!user){
      throw new UnauthorizedException ("User not found"); 
    }

    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
      throw new UnauthorizedException("Password incorrect");
    } 

    const payload = {role:'teacher', sub: user.teacherID, username: user.teacherName };
    return {
      access_token: await this.jwtService.signAsync(payload),
      name: user.teacherName
    };
  }

  async signUp (teacherName: string, email: string, pass: string): Promise<any> {
    const existUser = await this.classesService.findTeacherByEmail(email); 
    if (existUser){
      throw new ConflictException ("Email already in use");
    }

    const saltOrRounds = 10;
    const hashPassword = await bcrypt.hash(pass, saltOrRounds)

    const teacher = await this.classesService.newTeacher(teacherName, email, hashPassword); 
    if (teacher){
      const payload = {role:'teacher', sub: teacher.teacherID, username: teacher.teacherName };
    return {
      access_token: await this.jwtService.signAsync(payload),
      teacherID: teacher.teacherID,
      name: teacher.teacherName
    };
    }
  }

  async signInStudent (studentID: number, pass: string): Promise<any> {
    const user = await this.classesService.findStudentById(studentID);
    if (user?.password !== pass) {
      throw new UnauthorizedException("Password incorrect");
    }
    const payload = {role:'student', sub: user.studentID, username: user.studentName };
    return {
      access_token: await this.jwtService.signAsync(payload),
      name: user.studentName
    };
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
        return Number(userId) === Number(resourceId); 
      case 'execution':
        return this.validateTeacherAccessToStudentExecution (userId, resourceId); 
      case 'student': 
        return this.validateTeacherAccessToStudent (userId, resourceId); 
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

  private async validateTeacherAccessToStudentExecution (userId: number, executionID: number): Promise<boolean>{
    const studentID = await this.performanceService.findStudentByTaskExecution (executionID); 
    if (studentID){
      const teacherID = await this.classesService.findTeacherByStudent (studentID);
      if (teacherID) {
        return teacherID === userId; 
      }
    } 
    return false; 
  }

  private async validateTeacherAccessToStudent (userId: number, studentID: number):Promise<boolean>{
    const teacherID = await this.classesService.findTeacherByStudent (studentID);
    console.log ("teacher"); 
    console.log (teacherID); 
    console.log ("user"); 
    console.log (userId); 
    return teacherID === userId; 
  } 

  async validateAccessStudent(studentID: number,resourceType: string, resourceId: number): Promise<boolean>{
    switch (resourceType){
      case 'execution':
        return this.validateExecutionAccess (studentID, resourceId);
      case 'student': 
        return Number(studentID)===Number(resourceId);
    } 
  }

  private async validateExecutionAccess (studentID: number, executionID: number): Promise<boolean> {
    const ID = await this.performanceService.findStudentByTaskExecution(executionID); 
    return ID === studentID;
  }

  async getTokenToStudents (assignedID: number){
    const taskSended = await this.performanceService.isTaskSended(assignedID); 
    if (!taskSended){
      throw new NotFoundException ("Task not sended."); 
    }
    const token = this.jwtService.sign({ assignedID: assignedID }, {secret: jwtConstants.secret,  expiresIn: '180d' });
    return token; 
  }
}
