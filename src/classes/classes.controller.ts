import { Controller, Get, Param, Post, Body, Put } from '@nestjs/common';
import { ClasseService } from './classes.service';
import { AddStudentsDto, CreateClassDto } from './classes.dto';

@Controller('classes')
export class ClassesController {
  constructor(private readonly classesService: ClasseService) {}

  @Get(':id')
    async getStudents(@Param ('id') id: number) {
    return this.classesService.findStudentsByClass (id); 
  }

  @Post () 
    async newClass (@Body () createClassDto: CreateClassDto ){
      return this.classesService.createNewClass(createClassDto); 
    }

  @Put (':id')
    async addStudentsToClass (@Param ('id') classID: number, @Body () addStudentsDto: AddStudentsDto){
      return this.classesService.addStudentsToExistingClass(classID, addStudentsDto); 
    }

 
}
