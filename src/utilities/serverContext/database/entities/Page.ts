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
import { Section } from './Section'

@Entity()
export class Page extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @Index()
  id!: string

  @Column({ default: '' })
  title!: string

  @Column({ default: '' })
  className!: string

  @Column({ default: '', unique: true })
  @Index()
  route!: string

  @Column('int', { default: 0 })
  navOrder!: number

  @Column('text', { default: '' })
  css!: string

  @Column({ default: false })
  omitDefaultHeader!: boolean

  @Column({ default: false })
  omitDefaultFooter!: boolean

  @ManyToOne(() => Section, (section) => section.page, {
    onDelete: 'CASCADE',
  })
  sections!: Section[]

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date
}
