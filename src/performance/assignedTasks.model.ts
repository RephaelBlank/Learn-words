import { Column, DataType, Model, Table, ForeignKey, AutoIncrement, PrimaryKey, BelongsTo } from 'sequelize-typescript';
import { Classes } from 'src/classes/classes.model'; 
import { Tasks } from 'src/tasks/tasks.model';

@Table({ tableName: 'assigned-tasks', timestamps: false })
export class AssignedTasks extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column ({type: DataType.INTEGER})
  assignedID: number;
  
  @ForeignKey(() => Classes)
  @Column ({type: DataType.INTEGER})
  classID: number; 

  @ForeignKey(() => Tasks)
  @Column ({type: DataType.INTEGER})
  taskID: number; 

  @BelongsTo(() => Classes)
  class: Classes;

  @BelongsTo(() => Tasks)
  tasks: Tasks;
}