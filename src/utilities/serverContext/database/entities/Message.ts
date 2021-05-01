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
export class Message extends PapyrEntity {
  @PrimaryGeneratedColumn('uuid')
  @Index()
  id!: string

  @Column()
  name!: string

  @Column()
  email!: string

  @DbAwareColumn({ type: 'text' })
  message!: string

  @Column()
  emailSent!: boolean

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date

  toModel(): types.Message {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      message: this.message,
      emailSent: this.emailSent,
      updatedAt: new Date(this.updatedAt),
      createdAt: new Date(this.createdAt),
    }
  }

  static async saveFromModel(
    event: types.Message
  ): Promise<types.Message> {
    const messageRepo = getRepository<Message>('Message')
    let foundMessage = await messageRepo.findOne({
      where: {
        id: event.id,
      },
    })

    if (!foundMessage) {
      foundMessage = messageRepo.create()
    }

    foundMessage.name = event.name
    foundMessage.email = event.email
    foundMessage.message = event.message
    foundMessage.emailSent = event.emailSent

    foundMessage = await foundMessage.save()

    return await foundMessage.toModel()
  }
}
