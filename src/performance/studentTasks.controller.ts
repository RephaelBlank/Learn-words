import { Body, Controller , Get, Param, Post, Put} from '@nestjs/common';
import { PerformanceService } from './performance.service';

@Controller('performance')
export class StudentTasksController {
  constructor(private readonly performanceService: PerformanceService) {}

  @Get('student/:studentID')
  async getTasksbystudent(@Param ('studentID') studentID: number) {
    return this.performanceService.findTasksByStudent(studentID); 
  }

  @Get(':executionID')
  async getTaskExecutionById(@Param('executionID') executionID: number) {
    return await this.performanceService.getTaskToExecution(executionID);
  }

  @Put(':executionID') 
  async excutionTask ( @Param('executionID') executionID: number,  @Body () any) {
    return await this.performanceService.executionTask(executionID,any);
  }
  
}
