import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TasksExecutions } from './taskExecutions.model';
import { AssignedTasks } from './assignedTasks.model';
import { TeacherTasksController } from './teacherTasks.controller';
import { PerformanceService } from './performance.service';
import { StudentTasksController } from './studentTasks.controller';
import { TasksModule } from 'src/tasks/tasks.module';
import { ClassesModule } from 'src/classes/classes.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [SequelizeModule.forFeature([TasksExecutions, AssignedTasks]),TasksModule, ClassesModule, AuthModule],
    controllers: [TeacherTasksController, StudentTasksController ],
    providers: [PerformanceService], 
    exports: [PerformanceService]
  })
  export class PerformanceModule {}