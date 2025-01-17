import { Column, DataType, Model, Table, ForeignKey, AutoIncrement, PrimaryKey, HasMany } from 'sequelize-typescript';
import { Teachers } from './teachers.model';
import { Students } from './students.model'; 
import { AssignedTasks } from 'src/performance/assignedTasks.model';

@Table({ tableName: 'classes', timestamps: false,
    indexes: [
        {
          unique: false,
          fields: ['teacherID'], 
        },
      ]
})
export class Classes extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column ({type: DataType.INTEGER})
  classID: number;
  
  @Column({ type: DataType.STRING, allowNull: false })
  className: string;

  @ForeignKey(() => Teachers)
  @Column ({type: DataType.INTEGER})
  teacherID: number; 

  @HasMany (()=> Students)
  students: Students[];

  @HasMany (() => AssignedTasks)
  assignedTasks: AssignedTasks[];
}