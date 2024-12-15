import { Injectable, NotFoundException  } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Teachers } from './teachers.model';
import { Students } from './students.model';
import { Classes } from './classes.model';


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
      include: {
        model: Students,
        attributes: ['studentID', 'studentName'], 
      },
    });
    return getClass; 
  }

}
