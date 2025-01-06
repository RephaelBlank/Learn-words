import { IsArray, IsInt, IsNotEmpty,ArrayNotEmpty, Matches } from 'class-validator';

export class AssignTaskDto {
  @IsNotEmpty()
  resourceType: string; 
  
  @IsInt()
  classID: number;

  @IsInt()
  taskID: number;
}

export class SendTaskDto {
  @IsInt()
  taskID: number; 

  @IsNotEmpty()
  resourceType: string; 
}