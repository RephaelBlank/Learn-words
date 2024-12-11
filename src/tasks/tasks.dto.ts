import { IsArray, IsInt, IsNotEmpty,ArrayNotEmpty } from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty()
  taskName: string;
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  wordIds: number[];
}