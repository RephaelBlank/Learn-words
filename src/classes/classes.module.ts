import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ClasseService } from './classes.service';
import { ClassesController } from './classes.controller';
import { Teachers } from './teachers.model';
import { Students } from './students.model';
import { Classes } from './classes.model';
import { AuthModule } from 'src/auth/auth.module';


@Module({
    imports: [SequelizeModule.forFeature([Teachers, Students, Classes]), AuthModule],
    controllers: [ ClassesController ],
    providers: [ClasseService],
    exports: [ClasseService]
  })
  export class ClassesModule {}