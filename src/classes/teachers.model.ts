import { Column, DataType, Model, Table, BelongsToMany, AutoIncrement, PrimaryKey, HasMany } from 'sequelize-typescript';
import { Classes } from './classes.model';

@Table({ tableName: 'teachers', timestamps: false })
export class Teachers extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column ({type: DataType.INTEGER})
  teacherID: number;
  
  @Column({ type: DataType.STRING, allowNull: false })
  teacherName: string;

  @Column ({type: DataType.STRING, allowNull: false})
  email: string; 

  @Column({ type: DataType.STRING, allowNull: false })
  password: string;

  @HasMany (()=> Classes)
  classes: Classes[];
}