import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Blog } from './Blog'
import { User } from './User'

@Entity()
export class Comment extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @Index()
  id!: string

  @Column('text')
  content!: string

  @Column()
  @Index()
  blogId!: string

  @ManyToOne(() => Blog, (blog) => blog.comments, {
    onDelete: 'CASCADE',
  })
  blog!: Blog

  @Column()
  @Index()
  authorId!: string

  @ManyToOne(() => User, (user) => user.comments, {
    onDelete: 'CASCADE',
  })
  author!: User

  @Column()
  @Index()
  replyToId?: string

  @OneToMany(() => Comment, (comment) => comment.replies)
  replyTo?: Comment

  @ManyToOne(() => Comment, (comment) => comment.replyTo, {
    onDelete: 'CASCADE',
  })
  replies?: Comment[]

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date
}
