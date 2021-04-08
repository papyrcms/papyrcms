import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Page } from './Page'

@Entity()
export class Section extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @Index()
  id!: string

  @Column()
  @Index()
  pageId!: string

  @OneToMany(() => Page, (page) => page.sections)
  page!: Page

  @Column('int')
  order!: number

  @Column()
  type!: string

  @Column({ default: '' })
  tags!: string

  @Column({ default: '' })
  title!: string

  @Column({ default: '' })
  className!: string

  @Column('int')
  maxPosts!: number

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date
}
