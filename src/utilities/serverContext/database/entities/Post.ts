import {
  Column,
  CreateDateColumn,
  Entity,
  getRepository,
  Index,
  UpdateDateColumn,
} from 'typeorm'
import * as types from '@/types'
import { PapyrEntity } from './PapyrEntity'
import {
  DbAwareColumn,
  DbAwarePGC,
  sanitizeConditions,
} from '../utilities'

@Entity()
export class Post extends PapyrEntity {
  @DbAwarePGC()
  id!: string

  @Column({ default: '' })
  title!: string

  @Column({ default: '' })
  @Index()
  slug!: string

  @DbAwareColumn({ type: 'text' })
  content!: string

  @Column({ default: '' })
  tags!: string

  @Column({ default: '' })
  media!: string

  @Column({ default: false })
  isPublished!: boolean

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date

  toModel(): types.Post {
    return {
      id: this.id.toString(),
      title: this.title,
      tags: this.tags.split(',').map((tag) => tag.trim()),
      slug: this.slug,
      media: this.media,
      content: this.content,
      isPublished: this.isPublished,
      updatedAt: new Date(this.updatedAt),
      createdAt: new Date(this.createdAt),
    }
  }

  static async saveFromModel(post: types.Post): Promise<types.Post> {
    const postRepo = getRepository<Post>('Post')
    let foundPost

    if (post.id) {
      foundPost = await postRepo.findOne({
        where: sanitizeConditions({
          id: post.id,
        }),
      })
    }

    if (!foundPost) {
      foundPost = postRepo.create()
    }

    foundPost.title = post.title
    foundPost.slug = post.slug
    foundPost.tags = post.tags.join(', ')
    foundPost.media = post.media
    foundPost.content = post.content || ''
    foundPost.isPublished = post.isPublished

    foundPost = await foundPost.save()

    return await foundPost.toModel()
  }
}
