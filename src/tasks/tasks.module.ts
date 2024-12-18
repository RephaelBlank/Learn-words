import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from '../../test/tasks.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Tasks } from './tasks.model'; 
import { Words } from './words.model'; 
import { TaskWord } from './task-word.model'; 


@Module({
  imports: [SequelizeModule.forFeature([Tasks, Words, TaskWord])],
  controllers: [TasksController],
  providers: [TasksService],
  exports: [TasksService]
})
export class TasksModule {}
