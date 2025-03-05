import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { SequelizeModule } from '@nestjs/sequelize';

import { Sequelize } from 'sequelize-typescript';
import { TasksModule } from './tasks/tasks.module';
import { ClassesModule } from './classes/classes.module';
import { PerformanceModule } from './performance/performance.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    SequelizeModule.forRoot({
    dialect: 'postgres', 
    host: 'localhost', 
    port: 5432, 
    username: 'postgres', 
    password: 'mysecretpassword', 
    database: 'db_feb', 
    models: [], 
    autoLoadModels: true, 
    synchronize: true, 
  }),
  TasksModule,
  ClassesModule,
  PerformanceModule,
  AuthModule
],
  controllers: [AppController, ],
  providers: [AppService],
})

export class AppModule {
  constructor(private sequelize: Sequelize) {}

  async onModuleInit() {
    await this.sequelize.sync({ alter: true }); 
  }
}