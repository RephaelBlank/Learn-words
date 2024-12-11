import {PipeTransform, Injectable, NotFoundException  } from '@nestjs/common';
import { TasksService } from './tasks.service';

@Injectable()
export class WordsExistsPipe implements PipeTransform{
    constructor( private readonly tasksService: TasksService) {}

    async transform(value: number[]): Promise<number[]>{
        const numbersInDB = await this.tasksService.findWords (value); 
        if (numbersInDB.length !== value.length) {
            const missingIds = value.filter(id => !numbersInDB.some(word => word.wordID === id));
            throw new NotFoundException(`Words with IDs ${missingIds.join(',')} not found`);
        }
        return value;  
    }
}