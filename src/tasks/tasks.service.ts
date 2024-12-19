import { Injectable, NotFoundException  } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Tasks } from './tasks.model';
import { Words } from './words.model';
import { TaskWord } from './task-word.model';
import { CreateTaskDto } from './tasks.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Tasks) private readonly taskModel: typeof Tasks,
    @InjectModel(Words) private readonly wordModel: typeof Words,
    @InjectModel(TaskWord) private readonly taskWordModel: typeof TaskWord
  ) {}

  async createTask(createTaskDto: CreateTaskDto) {
    const { taskName, wordIds } = createTaskDto;

    const task = await this.taskModel.create({ taskName });

    if (wordIds){
    const words = await this.wordModel.findAll({
        where: { wordID: wordIds },
      });

      await task.$add('words', words);
    }
    return task;
  }

  async updateTask(taskID, createTaskDto: CreateTaskDto){
    const task = await this.findTaskById (taskID); 
    
    if (createTaskDto.taskName){
      task.taskName = createTaskDto.taskName; 
    }

    if (createTaskDto.wordIds){
    const words = await this.wordModel.findAll({
      where: { wordID: createTaskDto.wordIds },
    });

    await task.$set('words', words);
  }

    await task.save();
  }

  async findTaskById (taskID: number){ 
    const task = await this.taskModel.findOne ({
      where: {taskID}
    });
    return task;
  }

  async findWords (wordIds: number[]){
    return this.wordModel.findAll({
      where: {
        wordID: wordIds,
      },
    });
  }
  

  async getTask(taskID: number) {
    const task = await this.taskModel.findOne({
      where: { taskID },
      include: {
        model: Words,
        through: { attributes: [] }, 
      },
    });

    return task;
  }

  async deleteTask (taskID: number){
    return await this.taskModel.destroy({where: { taskID: taskID }})
  }
}
