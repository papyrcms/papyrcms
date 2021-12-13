import {
  Column,
  CreateDateColumn,
  Entity,
  getRepository,
  Index,
  OneToMany,
  UpdateDateColumn,
} from 'typeorm'
import { Page } from './Page'
import * as types from '../../../../types'
import { PapyrEntity } from './PapyrEntity'
import { DbAwarePGC, sanitizeConditions } from '../utilities'

@Entity()
export class Section extends PapyrEntity {
  @DbAwarePGC()
  id!: string

  @Column()
  @Index('uuid')
  pageId!: string

  @OneToMany(() => Page, (page) => page.sections)
  page!: Partial<Page>

  @Column('int')
  order!: number

  @Column()
  type!: string

  @Column({ default: '' })
  tags!: string

  @Column('varchar', { default: 'post' })
  postType!: types.PostType

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
      id: this.id.toString(),
      order: this.order,
      pageId: this.pageId,
      type: this.type,
      postType: this.postType,
      maxPosts: this.maxPosts,
      tags: this.tags.split(',').map((tag) => tag.trim()),
      title: this.title,
      className: this.className,
      updatedAt: new Date(this.updatedAt),
      createdAt: new Date(this.createdAt),
    }
  }

  static async saveFromModel(
    section: types.Section
  ): Promise<types.Section> {
    const sectionRepo = getRepository<Section>('Section')
    let foundSection

    if (section.id) {
      foundSection = await sectionRepo.findOne({
        where: sanitizeConditions({
          id: section.id,
        }),
      })
    }

    if (!foundSection) {
      foundSection = sectionRepo.create()
    }

    foundSection.pageId = section.pageId
    foundSection.order = section.order
    foundSection.type = section.type
    foundSection.postType = section.postType
    foundSection.tags = section.tags.join(', ')
    foundSection.maxPosts = section.maxPosts
    foundSection.title = section.title
    foundSection.className = section.className

    foundSection = await foundSection.save()

    return await foundSection.toModel()
  }
}
