import { Column, DataType, Model, Table, ForeignKey, AutoIncrement, PrimaryKey, BelongsTo } from 'sequelize-typescript';
import { Classes } from './classes.model';

@Table({ tableName: 'students', timestamps: false })
export class Students extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column ({type: DataType.INTEGER})
  studentID: number;
  
  @Column({ type: DataType.STRING, allowNull: false })
  studentName: string;

  @Column({ type: DataType.STRING, allowNull: false })
  password: string;

  @ForeignKey(() => Classes)
  @Column ({type: DataType.INTEGER})
  classID: number; 

  @BelongsTo(() => Classes)
  class: Classes;
}