import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Options } from './Options'

@Entity()
export class Settings extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @Index()
  id!: string

  @Column()
  name!: string

  @ManyToOne(() => Options, (options) => options.settings, {
    onDelete: 'CASCADE',
  })
  options!: Options[]

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date
}
