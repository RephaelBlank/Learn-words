import { Controller, Get, Param, Post, Body, Put, UseGuards, Request } from '@nestjs/common';
import { ClasseService } from './classes.service';
import { AddStudentsDto, CreateClassDto } from './classes.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';

@Controller('classes')
export class ClassesController {
  constructor(private readonly classesService: ClasseService) {}

  @UseGuards (AuthGuard, RolesGuard)
  @Get(':id')
    async getStudents(@Param ('id') classID: number) {
    return this.classesService.findStudentsByClass (classID); 
  }

  @UseGuards (AuthGuard)
  @Get()
    async getClasses(@Request () req) {
    return this.classesService.findClassesByTeacher (req.user.sub); 
  }

  @UseGuards (AuthGuard, RolesGuard)
  @Post () 
    async newClass (@Body () createClassDto: CreateClassDto ){
      return this.classesService.createNewClass(createClassDto); 
    }

  @UseGuards (AuthGuard, RolesGuard)
  @Put (':id')
    async addStudentsToClass (@Param ('id') classID: number, @Body () addStudentsDto: AddStudentsDto){
      return this.classesService.addStudentsToExistingClass(classID, addStudentsDto); 
    }

 
}
