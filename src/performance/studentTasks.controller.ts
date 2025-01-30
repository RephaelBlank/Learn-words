import { Body, Controller , Get, Param, Post, Put, Request, UseGuards} from '@nestjs/common';
import { PerformanceService } from './performance.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { TaskAuthGuard } from 'src/auth/task.guard';

@Controller('performance')
export class StudentTasksController {
  constructor(private readonly performanceService: PerformanceService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Get('student/:studentID')
  async getTasksbystudent(@Param ('studentID') studentID: number) {
    return this.performanceService.findTasksByStudent(studentID); 
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Get(':executionID')
  async getTaskExecutionById(@Param('executionID') executionID: number) {
    return await this.performanceService.getTaskToExecution(executionID);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Put(':executionID') 
  async excutionTask ( @Param('executionID') executionID: number,  @Body () any) {
    return await this.performanceService.executionTask(executionID,any);
  }

  @Get('students/:assignedID')
  async getStudentsByAssignedTask(@Param('assignedID') assignedID : number) {
    return await this.performanceService.findStudentsByAssignedTask(assignedID);
  }

  @UseGuards(TaskAuthGuard)
  @Get('list/students')
  async getStudentsList(@Request() req) {
    const taskId = req['taskId'];
    return this.performanceService.findStudentsByAssignedTask(taskId);
}
  
}
