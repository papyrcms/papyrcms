import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Comment } from './Comment'
import * as types from '@/types'
import { PapyrEntity } from './PapyrEntity'

@Entity()
export class Blog extends PapyrEntity {
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
  comments!: Partial<Comment[]>

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

  static async saveFromModel(blog: types.Blog): Promise<types.Blog> {
    let foundBlog = await Blog.findOne({
      where: {
        id: blog.id,
      },
    })

    if (!foundBlog) {
      foundBlog = Blog.create()
    }

    foundBlog.title = blog.title
    foundBlog.slug = blog.slug
    foundBlog.tags = blog.tags.join(', ')
    foundBlog.media = blog.media
    foundBlog.content = blog.content
    foundBlog.isPublished = blog.isPublished

    foundBlog.publishedAt =
      blog.isPublished && !blog.publishedAt
        ? new Date()
        : blog.publishedAt

    foundBlog = await foundBlog.save()

    return await foundBlog.toModel()
  }
}
