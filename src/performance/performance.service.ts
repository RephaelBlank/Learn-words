import { Injectable ,InternalServerErrorException,NotFoundException} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { TasksExecutions } from './taskExecutions.model';
import { AssignedTasks } from './assignedTasks.model';
import { Tasks } from 'src/tasks/tasks.model';
import { Words } from 'src/tasks/words.model';
import { Students } from 'src/classes/students.model';
import { AssignTaskDto, SendTaskDto } from './assignTask.dto';
import { TasksService } from 'src/tasks/tasks.service';
import { ClasseService } from 'src/classes/classes.service';
import { Definitions } from 'src/tasks/definitions.model';

import axios from 'axios'; 
import { Classes } from 'src/classes/classes.model';

@Injectable()
export class PerformanceService {
    constructor(
        @InjectModel(TasksExecutions) private readonly tasksExecutionsModel: typeof TasksExecutions,
        @InjectModel(AssignedTasks) private readonly assignedTasksModel: typeof AssignedTasks,
        private readonly tasksService: TasksService,
        private readonly classesService: ClasseService
    ){}

    async fetchDefinitionFromAPI(word: string): Promise<string> {
      try {
        const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        const definition = response.data[0]?.meanings[0]?.definitions[0]?.definition;
       
        return definition || 'No definition available';; 
      } catch (error) {
          console.error(`Failed to fetch definition for word "${word}":`, error.message);
          throw new InternalServerErrorException("Failed to fetch definition for word"); 
          return 'Definition not found'; 
      }
  }

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

    async findAssignedTask (assignedID: number){
      const assignedTask = await this.assignedTasksModel.findOne ({
        where: {assignedID: assignedID}, include: [
          {
            model: Classes, 
            include: [{
              model: Students,
              attributes: ['studentID', 'studentName'], 
            }]
          }
        ]
      })

      if (!assignedTask) {
        throw new NotFoundException(`No task found for assignedTask ID ${assignedID}`);
      }
      return assignedTask; 
    }
     

    async findTasksByStudent (studentID: number) {
        const tasksExecutions = await this.tasksExecutionsModel.findAll({
            where: { studentID },
            include: [
              {
                model: AssignedTasks,
                include: [Tasks],
              },
            ],
            });

        if (!tasksExecutions) {
            throw new NotFoundException(`No task found for student ID ${studentID}`);
        }
        
        return tasksExecutions.map(taskExecution => ({
          executionID: taskExecution.executionID,
          assignedID: taskExecution.assignedID, 
          taskID: taskExecution.assignedTask.taskID,
          taskName: taskExecution.assignedTask.tasks.taskName,
          results: taskExecution.results,
          score: taskExecution.score,
          status: taskExecution.status,
          sendTime: taskExecution.createdAt, 
          submissionTime: taskExecution.updatedAt
      }));
    }

    async findTasksByStudentAndAssignedTask(studentId, taskId) {
      try {
        const tasksExecutions = await this.tasksExecutionsModel.findAll({
          where: {
            studentID: studentId,
            assignedID: taskId
          },
          include: [
            {
              model: AssignedTasks,
              include: [Tasks],
            },
          ],
        });
        //if there task not completed return execution ID, else return all tasks
        return tasksExecutions.map(taskExecution => ({
          executionID: taskExecution.executionID,
          assignedID: taskExecution.assignedID, 
          taskID: taskExecution.assignedTask.taskID,
          taskName: taskExecution.assignedTask.tasks.taskName,
          results: taskExecution.results,
          score: taskExecution.score,
          status: taskExecution.status,
          sendTime: taskExecution.createdAt, 
          submissionTime: taskExecution.updatedAt
      }));

      } catch (error) {
        console.error("Error fetching task performances:", error);
        throw error;
      }
    }

    async assignTaskToAllStudents (sendTaskDto: SendTaskDto){
        const taskID = sendTaskDto.taskID; 
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

      if (taskExecution.status === 'COMPLETED') {
        return taskExecution; 
      }

      const words = taskExecution.assignedTask.tasks.words.map(word => ({
        id: word.wordID,
        content: word.wordName,
      }));
  
      const definitions = await Promise.all(
        taskExecution.assignedTask.tasks.words.map(async word => {
          const definition = word.definition.definition || await this.fetchDefinitionFromAPI(word.wordName);
          return {
            id: word.definition.definitionID,
            content: definition
          };
        })
      );
      

      const shuffledWords = words.sort(() => Math.random() - 0.5);
      const shuffledDefinitions = definitions.sort(() => Math.random() - 0.5);
      
        return {
          words: shuffledWords,
          definitions: shuffledDefinitions,
        };
    }

    async verifyWordDefinitionPairs(executionID, pairs: { wordID: number; word: string, definitionID: number, definition: string }[]) {

        const taskExecution = await this.findTaskExecutionById(executionID);
        const words = taskExecution.assignedTask.tasks.words;

        const validationMap = words.reduce((map, word) => {
            map[word.wordID] = word.definition.definitionID;
            return map;
            }, {} as Record<number, number>);
        
        let correctAnswers = 0; 

        const results = pairs.map(pair => {
            const isValid = validationMap[pair.wordID] === pair.definitionID;
            if (isValid) {
              correctAnswers++;
            }
            return {
              word: pair.word, 
              definition: pair.definition,
              isValid,
              };
            });

        const totalPairs = pairs.length;
        const score = totalPairs > 0 ? (correctAnswers / totalPairs) * 100 : 0;
            
        return {results, score};
    }

    async executionTask (executionID: number, answers){
        const taskExecution = await this.tasksExecutionsModel.findOne({
            where: { executionID }});
            
            if (!taskExecution) {
              throw new NotFoundException('Task execution not found');
          }

        taskExecution.status = 'COMPLETED';

        const {results, score} = await this.verifyWordDefinitionPairs (executionID,answers); 

        console.log(results); 
        taskExecution.results = results; 
        taskExecution.score = score; 

        await taskExecution.save(); 

        return taskExecution; 
    }

    async findStudentByTaskExecution (executionID: number){
      const taskExecution = await this.tasksExecutionsModel.findOne({where:{ executionID}}); 
      if (taskExecution){
        return taskExecution.studentID; 
      }
      return 0; 
    }

    async findStudentsByAssignedTask (assignedID: number){
      const assignedTask = await this.findAssignedTask(assignedID);
      if (assignedTask){
        return assignedTask.class.students; 
      } 
      return null; 
    }

    async isTaskSended (assignedID: number){
      const taskSend = await this.tasksExecutionsModel.findOne({where: {assignedID: assignedID}}); 
      if (taskSend){
        return true; 
      }
      return false; 
    }
      
    }




