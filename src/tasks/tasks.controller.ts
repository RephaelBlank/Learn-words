import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './tasks.dto';
import { TaskExistsPipe } from './task-exist.pipe';
import { WordsExistsPipe } from './words-exist.pipe';


@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  async createTask(
    @Body('wordIds', WordsExistsPipe) wordIds: number[],
        @Body() createTaskDto: CreateTaskDto 
   ) {
    return this.tasksService.createTask(createTaskDto);
  }

  @Get(':id')
  async getTask(@Param ('id', TaskExistsPipe) taskID: number) {
    return this.tasksService.getTask(taskID);
  }

  @Delete(':id')
  async deleteTask(@Param('id', TaskExistsPipe) taskID: number) {
    return this.tasksService.deleteTask(taskID);
  }
}