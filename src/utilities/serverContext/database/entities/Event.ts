import {
  Column,
  CreateDateColumn,
  Entity,
  getRepository,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import * as types from '@/types'
import { PapyrEntity } from './PapyrEntity'
import { DbAwareColumn } from '../utilities'

@Entity()
export class Event extends PapyrEntity {
  @PrimaryGeneratedColumn('uuid')
  @Index()
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

  @Column()
  date!: Date

  @Column('float')
  latitude?: number

  @Column('float')
  longitude?: number

  @Column({ default: '' })
  address?: string

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date

  toModel(): types.Event {
    return {
      id: this.id,
      title: this.title,
      tags: this.tags.split(',').map((tag) => tag.trim()),
      slug: this.slug,
      media: this.media,
      content: this.content,
      isPublished: this.isPublished,
      latitude: this.latitude,
      longitude: this.longitude,
      address: this.address,
      date: new Date(this.date),
      updatedAt: new Date(this.updatedAt),
      createdAt: new Date(this.createdAt),
    }
  }

  static async saveFromModel(
    event: types.Event
  ): Promise<types.Event> {
    const eventRepo = getRepository<Event>('Event')
    let foundEvent = await eventRepo.findOne({
      where: {
        id: event.id,
      },
    })

    if (!foundEvent) {
      foundEvent = eventRepo.create()
    }

    foundEvent.title = event.title
    foundEvent.slug = event.slug
    foundEvent.tags = event.tags.join(', ')
    foundEvent.media = event.media
    foundEvent.content = event.content || ''
    foundEvent.isPublished = event.isPublished
    foundEvent.latitude = event.latitude
    foundEvent.longitude = event.longitude
    foundEvent.address = event.address
    foundEvent.date = event.date

    foundEvent = await foundEvent.save()

    return await foundEvent.toModel()
  }
}
