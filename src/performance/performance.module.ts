import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TasksExecutions } from './taskExecutions.model';
import { AssignedTasks } from './assignedTasks.model';
import { TeacherTasksController } from './teacherTasks.controller';
import { PerformanceService } from './performance.service';
import { StudentTasksController } from './studentTasks.controller';

@Module({
    imports: [SequelizeModule.forFeature([TasksExecutions, AssignedTasks])],
    controllers: [TeacherTasksController, StudentTasksController ],
    providers: [PerformanceService]
  })
  export class PerformanceModule {}