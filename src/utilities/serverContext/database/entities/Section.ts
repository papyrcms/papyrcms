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
import * as types from '@/types'

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

  toModel(): types.Section {
    return {
      id: this.id,
      order: this.order,
      type: this.type,
      tags: this.tags.split(',').map((tag) => tag.trim()),
      title: this.title,
      className: this.className,
      updatedAt: new Date(this.updatedAt),
      createdAt: new Date(this.createdAt),
    }
  }
}
