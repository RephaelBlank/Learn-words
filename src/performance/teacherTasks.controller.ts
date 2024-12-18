import { Body, Controller , Get, Param, Post} from '@nestjs/common';
import { PerformanceService } from './performance.service';
import { AssignTaskDto } from './assignTask.dto';


@Controller('teachers')
export class TeacherTasksController {
    constructor(private readonly performanceService: PerformanceService) {}

   @Post()
   async assignNewTask(@Body () assignTaskDto: AssignTaskDto)    {
return this.performanceService.assignTaskByClass(assignTaskDto);
}
 

  @Post(':id')
  async assignTaskByID (@Param ('id') taskID: number){
    return this.performanceService.assignTaskToAllStudents(taskID); 
  }

}
