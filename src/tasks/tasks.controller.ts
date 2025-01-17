import { Controller, Post, Body, Get, Param, Delete, Put, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './tasks.dto';
import { TaskExistsPipe } from './task-exist.pipe';
import { WordsExistsPipe } from './words-exist.pipe';


@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  async getWordsByPrefix(@Query('prefix') prefix: string) {
    return this.tasksService.findWordsByPrefix(prefix);
  }

  @Post()
  async createTask(
        @Body( WordsExistsPipe) createTaskDto: CreateTaskDto ) 
      {
    return this.tasksService.createTask(createTaskDto);
  }

  @Get(':id')
  async getTask(@Param ('id', TaskExistsPipe) taskID: number) {
    return this.tasksService.getTask(taskID);
  }

  @Put(':id')
  async updateTask (
    @Param ('id', TaskExistsPipe) taskID: number,
    @Body(WordsExistsPipe) createTaskDto: CreateTaskDto )
    {
      return this.tasksService.updateTask (taskID, createTaskDto); 
    }

  @Delete(':id')
  async deleteTask(@Param('id', TaskExistsPipe) taskID: number) {
    return this.tasksService.deleteTask(taskID);
  }
}