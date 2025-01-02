import { IsArray, IsInt, IsNotEmpty,ArrayNotEmpty, Matches } from 'class-validator';

export class AssignTaskDto {
  
  @IsInt()
  classID: number;

  @IsInt()
  taskID: number;

  @IsInt()
  teacherID: number;
}