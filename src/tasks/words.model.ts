import { Column, DataType, Model, Table, BelongsToMany, AutoIncrement, PrimaryKey, HasOne} from 'sequelize-typescript';
import { Tasks } from './tasks.model';
import { TaskWord } from './task-word.model';
import { Definitions } from './definitions.model';

@Table({ tableName: 'words', timestamps: false })
export class Words extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column ({type: DataType.INTEGER})
  wordID: number;
  
  @Column({ type: DataType.STRING, allowNull: false })
  wordName: string;

  @HasOne(() => Definitions)
  definition: Definitions;

  @BelongsToMany(() => Tasks, () => TaskWord)
  tasks: Tasks[];
}