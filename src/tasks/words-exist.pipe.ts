import {PipeTransform, Injectable, NotFoundException  } from '@nestjs/common';
import { TasksService } from './tasks.service';

@Injectable()
export class WordsExistsPipe implements PipeTransform{
    constructor( private readonly tasksService: TasksService) {}

    async transform(value: any): Promise<number[]>{
        if (!value.wordIds) {
            return value;
          }
        
        const wordIds = value.wordIds;
        const numbersInDB = await this.tasksService.findWords (wordIds); 
        if (numbersInDB.length !== wordIds.length) {
            const missingIds = wordIds.filter(id => !numbersInDB.some(word => word.wordID === id));
            throw new NotFoundException(`Words with IDs ${missingIds.join(',')} not found`);
        }
        return value;  
    }
}