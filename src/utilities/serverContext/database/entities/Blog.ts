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
import { Comment } from './Comment'

@Entity()
export class Blog extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @Index()
  id!: string

  @Column({ default: '' })
  title!: string

  @Column({ default: '' })
  @Index()
  slug!: string

  @Column({ default: '' })
  content!: string

  @Column({ default: '' })
  tags!: string

  @Column({ default: '' })
  media!: string

  @Column({ default: false })
  published!: boolean

  @Column()
  publishedAt?: Date

  @OneToMany(() => Comment, (comment) => comment.blog)
  comments!: Comment[]

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date
}
