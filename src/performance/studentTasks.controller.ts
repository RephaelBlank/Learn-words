import { Controller , Get, Param, Post} from '@nestjs/common';
import { PerformanceService } from './performance.service';

@Controller('performance')
export class StudentTasksController {
    constructor(private readonly performanceService: PerformanceService) {}

    @Get('student/:studentID')
    async getTasksbystudent(@Param ('studentID') studentID: number) {
    return this.performanceService.findTaskByStudent(studentID); 
  }

  @Get(':executionID')
  async getTaskExecutionById(@Param('executionID') executionID: number) {
    return await this.performanceService.findTaskExecutionById(executionID);
  }

}
