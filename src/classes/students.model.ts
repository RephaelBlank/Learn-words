import { Column, DataType, Model, Table, ForeignKey, AutoIncrement, PrimaryKey, HasMany } from 'sequelize-typescript';
import { Classes } from './classes.model';

@Table({ tableName: 'students', timestamps: true })
export class Students extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column ({type: DataType.INTEGER})
  studentID: number;
  
  @Column({ type: DataType.STRING, allowNull: false })
  studentName: string;

  @ForeignKey(() => Classes)
  @Column ({type: DataType.INTEGER})
  classID: number; 
}