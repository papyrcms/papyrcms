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
import * as types from '@/types'

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

  @Column('text', { default: '' })
  content!: string

  @Column({ default: '' })
  tags!: string

  @Column({ default: '' })
  media!: string

  @Column({ default: false })
  isPublished!: boolean

  @Column()
  publishedAt?: Date

  @OneToMany(() => Comment, (comment) => comment.blog)
  comments!: Comment[]

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date

  async toModel(): Promise<types.Blog> {
    const commentEntities = await Comment.find({
      where: {
        blogId: this.id,
      },
      order: { createdAt: 'DESC' },
    })
    const comments: types.Comment[] = []
    for (const comment of commentEntities) {
      comments.push(await comment.toModel())
    }

    return {
      id: this.id,
      title: this.title,
      tags: this.tags.split(',').map((tag) => tag.trim()),
      slug: this.slug,
      media: this.media,
      content: this.content,
      isPublished: this.isPublished,
      comments,
      publishedAt: this.publishedAt
        ? new Date(this.publishedAt)
        : undefined,
      updatedAt: new Date(this.updatedAt),
      createdAt: new Date(this.createdAt),
    }
  }
}
