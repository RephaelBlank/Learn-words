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
import { Definitions } from 'src/tasks/definitions.model';

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
                    include: [
                        {
                            model: Words,
                            include: [{
                                model: Definitions,
                                required: false,
                                }
                            ],
                        },
                    ], 
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

    async getTaskToExecution (executionID: number){
      const taskExecution = await this.findTaskExecutionById(executionID);

      const words = taskExecution.assignedTask.tasks.words.map(word => ({
        id: word.wordID,
        content: word.wordName,
      }));
  
      const definitions =  taskExecution.assignedTask.tasks.words.map(word => ({
        id: word.definition.definitionID,
        content: word.definition.definition,
      }));

      const shuffledWords = words.sort(() => Math.random() - 0.5);
      const shuffledDefinitions = definitions.sort(() => Math.random() - 0.5);
      
        return {
          words: shuffledWords,
          definitions: shuffledDefinitions,
        };
    }

    async verifyWordDefinitionPairs(executionID, pairs: { wordID: number; definitionID: number }[]) {

        const wordIDs = pairs.map(pair => pair.wordID);

        const taskExecution = await this.findTaskExecutionById(executionID);
        const words = taskExecution.assignedTask.tasks.words;

        const validationMap = words.reduce((map, word) => {
            map[word.wordID] = word.definition.definitionID;
            return map;
            }, {} as Record<number, number>);
          
        const results = pairs.map(pair => {
            const isValid = validationMap[pair.wordID] === pair.definitionID;
            return {
                ...pair,
                isValid,
              };
            });
          
        return results;
    }

    async executionTask (executionID: number, answers){
        const taskExecution = await this.tasksExecutionsModel.findOne({
            where: { executionID }}); 
        //taskExecution.answers = answers; 
        taskExecution.status = 'COMPLETED';

        //const pairs = JSON.parse(answers); 
        const result = await this.verifyWordDefinitionPairs (executionID,answers); 

        console.log(result); 

        taskExecution.score = 60; 

        await taskExecution.save(); 

        return taskExecution; 
    }
      
    }




