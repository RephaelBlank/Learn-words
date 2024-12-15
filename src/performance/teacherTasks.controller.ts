import { Controller , Get, Param, Post} from '@nestjs/common';
import { PerformanceService } from './performance.service';

@Controller('teachers')
export class TeacherTasksController {
    constructor(private readonly performanceService: PerformanceService) {}

   

  @Post(':id')
  async assignTaskByID (@Param ('id') taskID: number){
    return this.performanceService.assignTaskToAllStudents(taskID); 
  }

}
