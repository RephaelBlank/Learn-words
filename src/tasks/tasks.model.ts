import { Column, DataType, Model, Table, PrimaryKey, AutoIncrement, AllowNull, HasMany, BelongsToMany } from 'sequelize-typescript';
import { Words } from './words.model';
import { TaskWord } from './task-word.model';


@Table({ tableName: 'tasks', timestamps: true})
export class Tasks extends Model{
  @PrimaryKey
  @AutoIncrement
  @Column ({type: DataType.INTEGER})
  taskID: number;
  
  @Column ({type: DataType.STRING, allowNull: false})
  taskName: string;

  @HasMany(() => TaskWord)
  taskWords: TaskWord[];

  @BelongsToMany(() => Words, () => TaskWord)
  words: Words[];

}