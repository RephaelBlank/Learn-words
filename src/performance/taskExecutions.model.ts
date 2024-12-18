import { Column, DataType, Model, Table, ForeignKey, AutoIncrement, PrimaryKey, BelongsTo } from 'sequelize-typescript';
import { AssignedTasks } from './assignedTasks.model'; 
import { Students } from 'src/classes/students.model';

@Table({ tableName: 'tasks-executions', timestamps: true })
export class TasksExecutions extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column ({type: DataType.INTEGER})
  executionID: number;
  
  @ForeignKey(() => AssignedTasks)
  @Column ({type: DataType.INTEGER})
  assignedID: number; 

  @ForeignKey(() => Students)
  @Column ({type: DataType.INTEGER})
  studentID: number; 

  @Column({
    type: DataType.ENUM('PENDING', 'COMPLETED', 'CANCELED'),
    allowNull: false,
    defaultValue: 'PENDING',
  })
  status: 'PENDING' | 'COMPLETED' | 'CANCELED';

  @Column ({type: DataType.FLOAT})
  score: number; 

  @Column ({type: DataType.JSONB})
  answers: JSON; 

  @BelongsTo (() => AssignedTasks)
  assignedTask: AssignedTasks; 

  @BelongsTo(() => Students)
  student: Students;
}