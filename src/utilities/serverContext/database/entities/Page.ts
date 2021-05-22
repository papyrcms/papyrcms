import {
  Column,
  CreateDateColumn,
  Entity,
  getRepository,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm'
import { Section } from './Section'
import * as types from '@/types'
import { PapyrEntity } from './PapyrEntity'
import {
  DbAwareColumn,
  DbAwarePGC,
  sanitizeConditions,
} from '../utilities'

@Entity()
export class Page extends PapyrEntity {
  @DbAwarePGC()
  id!: string

  @Column({ default: '' })
  title!: string

  @Column({ default: '' })
  className!: string

  @Column({ default: '', unique: true })
  route!: string

  @Column('float', { default: 0 })
  navOrder!: number

  @DbAwareColumn({ type: 'text' })
  css!: string

  @Column({ default: false })
  omitDefaultHeader!: boolean

  @Column({ default: false })
  omitDefaultFooter!: boolean

  @ManyToOne(() => Section, (section) => section.page, {
    onDelete: 'CASCADE',
  })
  sections!: Partial<Section[]>

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date

  async toModel(): Promise<types.Page> {
    const sectionRepo = getRepository<Section>('Section')
    let sectionEntities = await sectionRepo.find({
      where: sanitizeConditions({
        pageId: this.id,
      }),
      order: { order: 'ASC' },
    })
    const sections = sectionEntities.map((section) =>
      section.toModel()
    )

    return {
      id: this.id.toString(),
      title: this.title,
      className: this.className,
      route: this.route,
      navOrder: this.navOrder,
      css: this.css,
      omitDefaultHeader: this.omitDefaultHeader,
      omitDefaultFooter: this.omitDefaultFooter,
      sections,
      updatedAt: new Date(this.updatedAt),
      createdAt: new Date(this.createdAt),
    }
  }

  static async saveFromModel(page: types.Page): Promise<types.Page> {
    const pageRepo = getRepository<Page>('Page')
    const sectionRepo = getRepository<Section>('Section')
    let foundPage

    if (page.id) {
      foundPage = await pageRepo.findOne({
        where: sanitizeConditions({
          id: page.id,
        }),
      })
    }

    if (!foundPage) {
      foundPage = pageRepo.create()
    }

    foundPage.title = page.title
    foundPage.className = page.className
    foundPage.route = page.route
    foundPage.navOrder = page.navOrder
    foundPage.css = page.css || ''
    foundPage.omitDefaultHeader = page.omitDefaultHeader
    foundPage.omitDefaultFooter = page.omitDefaultFooter

    foundPage = await foundPage.save()

    let i = 0
    let sectionIds: string[] = []
    for (const section of page.sections) {
      section.pageId = foundPage.id
      section.order = i
      i++
      const { id } = await Section.saveFromModel(section)
      sectionIds.push(id.toString())
    }

    const sections = await sectionRepo.find({
      where: sanitizeConditions({
        pageId: foundPage.id.toString(),
      }),
    })

    for (const section of sections) {
      if (!sectionIds.includes(section.id.toString())) {
        await section.remove()
      }
    }

    return await foundPage.toModel()
  }
}
