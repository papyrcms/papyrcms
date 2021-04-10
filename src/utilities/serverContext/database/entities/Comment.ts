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
import * as types from '@/types'

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

  async toModel(): Promise<types.Comment> {
    const commentEntities = await Comment.find({
      where: {
        replyToId: this.id,
      },
      order: { createdAt: 'DESC' },
    })
    const replies: types.Comment[] = []
    for (const comment of commentEntities) {
      replies.push(await comment.toModel())
    }

    const authorEntity = await User.findOne({
      where: {
        id: this.authorId,
      },
    })
    const author = (await authorEntity?.toModel()) as types.User

    return {
      id: this.id,
      content: this.content,
      replies,
      author,
      updatedAt: new Date(this.updatedAt),
      createdAt: new Date(this.createdAt),
    }
  }

  static async saveFromModel(
    comment: types.Comment
  ): Promise<types.Comment> {
    let foundComment = await Comment.findOne({
      where: {
        id: comment.id,
      },
    })

    if (!foundComment) {
      foundComment = Comment.create()
    }

    foundComment.content = comment.content

    foundComment = await foundComment.save()

    return await foundComment.toModel()
  }
}
