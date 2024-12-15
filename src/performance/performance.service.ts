import { Injectable ,NotFoundException} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { TasksExecutions } from './taskExecutions.model';
import { AssignedTasks } from './assignedTasks.model';
import { Tasks } from 'src/tasks/tasks.model';
import { Words } from 'src/tasks/words.model';
import { Students } from 'src/classes/students.model';
import { AssignTaskDto } from './assignTask.dto';

@Injectable()
export class PerformanceService {
    constructor(
        @InjectModel(TasksExecutions) private readonly tasksExecutionsModel: typeof TasksExecutions,
        @InjectModel(AssignedTasks) private readonly assignedTasksModel: typeof AssignedTasks
    ){}

    async assignTaskByClass (assignTaskDto: AssignTaskDto){
       const {classID, taskID} = assignTaskDto; 
       const newTask = await this.assignedTasksModel.create({
        classID,
        taskID,
      });

    }
     

      async findTaskByStudent (studentID: number) {
        const taskExecution = await this.tasksExecutionsModel.findAll({
            where: { studentID },
            include: [
              {
                model: AssignedTasks,
                include: [
                  {
                    model: Tasks,
                    include: [Words], 
                  },
                ],
              },
            ],
          });

          if (!taskExecution) {
            throw new Error(`No task found for student ID ${studentID}`);
          }
      
          return taskExecution;
        }

    async assignTaskToAllStudents (taskID: number){
        const assignedTask = await AssignedTasks.findOne({
            where:
             { assignedID: taskID },
        }); 
        if (!assignedTask) {
            return (404);
          }

          const studentsInClass = await Students.findAll({
            where: { classID: assignedTask.classID }, 
          });

          const tasksExecutions = studentsInClass.map(student => {
            return {
              studentID: student.studentID,
              assignedID: assignedTask.assignedID,
              status: 'pending', 
            };
          });

          await TasksExecutions.bulkCreate(tasksExecutions);
      
    }

    async findTaskExecutionById (executionID: number){
        const taskExecution = await this.tasksExecutionsModel.findOne({
            where: { executionID },
            include: [
              {
                model: AssignedTasks,
                include: [
                  {
                    model: Tasks,
                    include: [Words], 
                  },
                ],
              },
            ],
          });
      
          if (!taskExecution) {
            throw new NotFoundException('Task execution not found');
          }
      
          return taskExecution;
        }
      
    }




