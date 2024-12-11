import { Column, DataType, Model, Table, ForeignKey } from 'sequelize-typescript';
import { Tasks } from './tasks.model';
import { Words } from './words.model';

@Table({ tableName: 'task_words', timestamps: false })
export class TaskWord extends Model {
  @ForeignKey(() => Tasks)
  @Column({ type: DataType.INTEGER })
  taskId: number;

  @ForeignKey(() => Words)
  @Column({ type: DataType.INTEGER })
  wordId: number;
}