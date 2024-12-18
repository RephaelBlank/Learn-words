import { Column, DataType, Model, Table, BelongsToMany, AutoIncrement, PrimaryKey } from 'sequelize-typescript';
import { Tasks } from './tasks.model';
import { TaskWord } from './task-word.model';

@Table({ tableName: 'words', timestamps: true })
export class Words extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column ({type: DataType.INTEGER})
  wordID: number;
  
  @Column({ type: DataType.STRING, allowNull: false })
  wordName: string;

  @Column({ type: DataType.STRING, allowNull: true })
  definition: string;

  @Column({ type: DataType.INTEGER, allowNull: true })
  definitionID: number;

  @BelongsToMany(() => Tasks, () => TaskWord)
  tasks: Tasks[];
}