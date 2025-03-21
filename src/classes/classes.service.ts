import { Injectable, NotFoundException  } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Teachers } from './teachers.model';
import { Students } from './students.model';
import { Classes } from './classes.model';
import { AddStudentsDto, CreateClassDto } from './classes.dto';
import { AssignedTasks } from 'src/performance/assignedTasks.model';
import { Tasks } from 'src/tasks/tasks.model';


@Injectable()
export class ClasseService {
    constructor(
        @InjectModel(Teachers) private readonly teachersModel: typeof Teachers,
        @InjectModel( Students) private readonly studentsModel: typeof Students,
        @InjectModel(Classes) private readonly classesModel: typeof Classes
      ) {}

    async findClassesByTeacher (teacherID: number){
        return this.classesModel.findAll({
            where: { teacherID },
          });
    }

    async findStudentsByClass (classID: number){
      const getClass = await this.classesModel.findOne({
        where: { classID },
        include: [{
          model: Students,
          attributes: ['studentID', 'studentName'], 
        },
        {
          model: AssignedTasks, 
          attributes: ['taskID','assignedID'],
          include: [Tasks]
        },
      ],
      });
      return getClass; 
    }

    async findClassById (classID: number){ 
      const classTo = await this.classesModel.findOne ({
        where: {classID}
      });
      return classTo;
    }

    async findTeacherById (teacherID: number){
      const teacher = await this.teachersModel.findOne ({
        where: {teacherID}
      });
      return teacher;
    }

    async findTeacherByEmail (teacherEmail: string){
      const teacher = await this.teachersModel.findOne ({
        where: {email: teacherEmail}
      });
      return teacher;
    }

    async findStudentById (studentID: number){
      const student = await this.studentsModel.findOne ({
        where: {studentID}
      });
      return student;
    }

    async createNewClass (createClassDto: CreateClassDto){
      const {className, teacherID,studentsNames} = createClassDto;
      
      const teacher = await this.findTeacherById (teacherID); 
      if (!teacher){
        throw new NotFoundException(`Teacher ${teacherID} not found`);
      }
      const newClass = await this.classesModel.create({className, teacherID});
      await this.addStudentsToClass (newClass, studentsNames); 
      return newClass; 
    }

    async addStudentsToExistingClass (classID: number, addStudentsDto: AddStudentsDto){
      const targetClass = await this.findClassById(classID); 
      if (!targetClass){
        throw new NotFoundException(`Class ${classID} not found`);
      }
      await this.addStudentsToClass (targetClass, addStudentsDto.studentsNames); 
      return targetClass; 
    }

    async addStudentsToClass (targetClass, studentsNames: string[]){
        const students = await this.studentsModel.bulkCreate(
        studentsNames.map((studentName) => ({ studentName: studentName, password: studentName + "123" }))
      );

      await targetClass.$add('students', students); 
    }

    async newTeacher (teacherName: string, email: string, password: string) {
      const teacher = await this.teachersModel.create({teacherName, email, password}); 
      return teacher; 
    }

    async findTeacherByStudent (studentID: number){
      const student = await this.studentsModel.findOne ({where: {studentID}, include: [{
        model: Classes, attributes: ['teacherID']
      }]})
      return student.class.teacherID; 
    }

}
