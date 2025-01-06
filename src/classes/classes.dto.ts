import { IsArray, IsInt, IsNotEmpty,ArrayNotEmpty, Matches, IsString } from 'class-validator';

export class CreateClassDto {
  @IsNotEmpty()
  @Matches(/\S/, { message: 'taskName must not be empty or contain only whitespace' })
  className: string;
  @IsInt ()
  teacherID: number; 
  @IsArray()
  @ArrayNotEmpty()
  @IsString ({each: true})
  studentsNames: string[];

  @IsNotEmpty()
  resourceType: string;
}

export class AddStudentsDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString ({each: true})
  studentsNames: string[];

  @IsInt ()
  classID: number; 

  @IsNotEmpty()
  resourceType: string;
}