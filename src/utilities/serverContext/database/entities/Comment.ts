import {
  Column,
  CreateDateColumn,
  Entity,
  getRepository,
  Index,
  ManyToOne,
  OneToMany,
  UpdateDateColumn,
} from 'typeorm'
import { Blog } from './Blog'
import { User } from './User'
import * as types from '@/types'
import { PapyrEntity } from './PapyrEntity'
import {
  DbAwareColumn,
  DbAwarePGC,
  sanitizeConditions,
} from '../utilities'

@Entity()
export class Comment extends PapyrEntity {
  @DbAwarePGC()
  id!: string

  @DbAwareColumn({ type: 'text' })
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
  author!: Partial<User>

  @Column()
  @Index()
  replyToId?: string

  @OneToMany(() => Comment, (comment) => comment.replies)
  replyTo?: Partial<Comment>

  @ManyToOne(() => Comment, (comment) => comment.replyTo, {
    onDelete: 'CASCADE',
  })
  replies?: Partial<Comment[]>

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date

  async toModel(): Promise<types.Comment> {
    const commentRepo = getRepository<Comment>('Comment')
    const userRepo = getRepository<User>('User')
    const commentEntities = await commentRepo.find({
      where: sanitizeConditions({
        replyToId: this.id,
      }),
      order: { createdAt: 'DESC' },
    })
    const replies: types.Comment[] = []
    for (const comment of commentEntities) {
      replies.push(await comment.toModel())
    }

    const authorEntity = await userRepo.findOne({
      where: sanitizeConditions({
        id: this.authorId,
      }),
    })
    const author = (await authorEntity?.toModel()) as types.User

    return {
      id: this.id.toString(),
      content: this.content,
      blogId: this.blogId,
      replies,
      author,
      updatedAt: new Date(this.updatedAt),
      createdAt: new Date(this.createdAt),
    }
  }

  static async saveFromModel(
    comment: types.Comment
  ): Promise<types.Comment> {
    const commentRepo = getRepository<Comment>('Comment')
    let foundComment

    if (comment.id) {
      foundComment = await commentRepo.findOne({
        where: sanitizeConditions({
          id: comment.id,
        }),
      })
    }

    if (!foundComment) {
      foundComment = commentRepo.create()
    }

    foundComment.content = comment.content
    foundComment.authorId = comment.author.id as string
    foundComment.blogId = comment.blogId

    foundComment = await foundComment.save()

    return await foundComment.toModel()
  }
}
