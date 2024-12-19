import { Injectable ,InternalServerErrorException,NotFoundException} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { TasksExecutions } from './taskExecutions.model';
import { AssignedTasks } from './assignedTasks.model';
import { Tasks } from 'src/tasks/tasks.model';
import { Words } from 'src/tasks/words.model';
import { Students } from 'src/classes/students.model';
import { AssignTaskDto } from './assignTask.dto';
import { TasksService } from 'src/tasks/tasks.service';
import { ClasseService } from 'src/classes/classes.service';

@Injectable()
export class PerformanceService {
    constructor(
        @InjectModel(TasksExecutions) private readonly tasksExecutionsModel: typeof TasksExecutions,
        @InjectModel(AssignedTasks) private readonly assignedTasksModel: typeof AssignedTasks,
        private readonly tasksService: TasksService,
        private readonly classesService: ClasseService
    ){}

    async assignTaskByClass (assignTaskDto: AssignTaskDto){
        const {classID, taskID} = assignTaskDto; 

        const task = await this.tasksService.findTaskById(taskID);
        if (!task) {
            throw new NotFoundException(`Task ${taskID} not found`);
        }

        const classTo = await this.classesService.findClassById(classID)
        if (!classTo) {
            throw new NotFoundException(`Class ${classID} not found`);
        }

        try {
            const newTask = await this.assignedTasksModel.create({
            classID,
            taskID,
            });
            if (!newTask) {
                throw new Error('Failed to assign task. The database returned an empty response.');
            }

            return newTask;
        }
        catch (error){
            throw new InternalServerErrorException(`could not assign task: ${error.message}`);
        } 

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
            throw new NotFoundException(`No task found for student ID ${studentID}`);
        }
      
        return taskExecution;
    }

    async assignTaskToAllStudents (taskID: number){
        const assignedTask = await AssignedTasks.findOne({
            where:
             { assignedID: taskID },
        }); 
        if (!assignedTask) {
            throw new NotFoundException(`assigned task ${taskID} not found`);
          }

        const studentsInClass = await Students.findAll({
            where: { classID: assignedTask.classID }, 
            });

        const tasksExecutions = studentsInClass.map(student => {
            return {
                studentID: student.studentID,
                assignedID: assignedTask.assignedID,
                status: 'PENDING', 
            };
        });

        await TasksExecutions.bulkCreate(tasksExecutions);

        return tasksExecutions; 
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

    async executionTask (executionID: number, answers: JSON){
        const taskExecution = await this.tasksExecutionsModel.findOne({
            where: { executionID }}); 
        taskExecution.answers = answers; 
        taskExecution.status = 'COMPLETED';
        taskExecution.score = 60; 

        await taskExecution.save(); 

        return taskExecution; 
    }
      
    }




