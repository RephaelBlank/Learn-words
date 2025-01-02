import { Body, Controller , Get, Param, Post, UseGuards} from '@nestjs/common';
import { PerformanceService } from './performance.service';
import { AssignTaskDto } from './assignTask.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';


@Controller('teachers')
export class TeacherTasksController {
    constructor(private readonly performanceService: PerformanceService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Post('assign/:teacherID')
  async assignNewTask(@Body () assignTaskDto: AssignTaskDto)    {
    console.log ("Connection sucsses!!!!!!");
    return this.performanceService.assignTaskByClass(assignTaskDto);
  }
 

  @Post(':id')
  async assignTaskByID (@Param ('id') taskID: number){
    return this.performanceService.assignTaskToAllStudents(taskID); 
  }

}
