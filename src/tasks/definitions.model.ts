import { Column, DataType, Model, Table, ForeignKey, AutoIncrement, PrimaryKey } from 'sequelize-typescript';
import { Words } from './words.model';

@Table({ tableName: 'definitions', timestamps: false })
export class Definitions extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column ({type: DataType.INTEGER})
  definitionID: number;
  
  @Column({ type: DataType.STRING, allowNull: true })
  definition: string;

  @ForeignKey(() => Words)
  @Column({ type: DataType.INTEGER, allowNull: false })
  wordID: number;
}