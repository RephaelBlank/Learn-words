import { Test, TestingModule } from '@nestjs/testing';
import { TeacherTasksController } from '../src/performance/teacherTasks.controller';

describe('PerformanceController', () => {
  let controller: TeacherTasksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeacherTasksController],
    }).compile();

    controller = module.get<TeacherTasksController>(TeacherTasksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
