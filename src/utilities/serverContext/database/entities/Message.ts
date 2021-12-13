import {
  Column,
  CreateDateColumn,
  Entity,
  getRepository,
  UpdateDateColumn,
} from 'typeorm'
import * as types from '../../../../types'
import { PapyrEntity } from './PapyrEntity'
import {
  DbAwareColumn,
  DbAwarePGC,
  sanitizeConditions,
} from '../utilities'

@Entity()
export class Message extends PapyrEntity {
  @DbAwarePGC()
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
      id: this.id.toString(),
      name: this.name,
      email: this.email,
      message: this.message,
      emailSent: this.emailSent,
      updatedAt: new Date(this.updatedAt),
      createdAt: new Date(this.createdAt),
    }
  }

  static async saveFromModel(
    message: types.Message
  ): Promise<types.Message> {
    const messageRepo = getRepository<Message>('Message')
    let foundMessage

    if (message.id) {
      foundMessage = await messageRepo.findOne({
        where: sanitizeConditions({
          id: message.id,
        }),
      })
    }

    if (!foundMessage) {
      foundMessage = messageRepo.create()
    }

    foundMessage.name = message.name
    foundMessage.email = message.email
    foundMessage.message = message.message
    foundMessage.emailSent = message.emailSent

    foundMessage = await foundMessage.save()

    return await foundMessage.toModel()
  }
}
