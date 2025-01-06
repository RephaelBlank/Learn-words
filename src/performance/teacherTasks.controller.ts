import { Body, Controller , Get, Param, Post, UseGuards} from '@nestjs/common';
import { PerformanceService } from './performance.service';
import { AssignTaskDto, SendTaskDto } from './assignTask.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';


@Controller('teachers')
export class TeacherTasksController {
    constructor(private readonly performanceService: PerformanceService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Post('assign')
  async assignNewTask(@Body () assignTaskDto: AssignTaskDto)    {
    console.log ("Connection sucsses!!!!!!");
    return this.performanceService.assignTaskByClass(assignTaskDto);
  }
 
  @UseGuards(AuthGuard, RolesGuard)
  @Post('send')
  async assignTaskByID (@Body () sendTaskDto: SendTaskDto){
    return this.performanceService.assignTaskToAllStudents(sendTaskDto); 
  }

}
