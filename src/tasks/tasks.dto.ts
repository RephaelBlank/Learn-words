import { IsArray, IsInt, IsNotEmpty,ArrayNotEmpty, Matches } from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty()
  @Matches(/\S/, { message: 'taskName must not be empty or contain only whitespace' })
  taskName: string;
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  wordIds: number[];
}