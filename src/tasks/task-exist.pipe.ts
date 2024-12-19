import {PipeTransform, Injectable, NotFoundException  } from '@nestjs/common';
import { TasksService } from './tasks.service';

@Injectable()
export class TaskExistsPipe implements PipeTransform {
  constructor( private readonly tasksService: TasksService) {}

  async transform(value: number): Promise<number> {
    const task = await this.tasksService.findTaskById(value); 
    if (!task) {
      throw new NotFoundException(`Task with ID ${value} not found`);
    }
    return value; 
  }
}