import { Controller, Get, Param } from '@nestjs/common';
import { ClasseService } from './classes.service';

@Controller('classes')
export class ClassesController {
    constructor(private readonly classesService: ClasseService) {}

    @Get(':id')
    async getStudents(@Param ('id') id: number) {
    return this.classesService.findStudentsByClass (id); 
  }

 
}
