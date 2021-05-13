import {
  Column,
  CreateDateColumn,
  Entity,
  getRepository,
  Index,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm'
import jwt from 'jsonwebtoken'
import { PapyrEntity } from './PapyrEntity'
import * as types from '@/types'
import { DbAwarePGC } from '../utilities'
import { User } from './User'
import keys from '@/keys'

@Entity()
export class Token extends PapyrEntity {
  @DbAwarePGC()
  id!: string

  @Column()
  @Index()
  value!: string

  @Column()
  @Index()
  expiry!: Date

  @Column()
  issued!: Date

  @Column()
  @Index()
  userId!: string

  @ManyToOne(() => User, (user) => user.tokens, {
    onDelete: 'CASCADE',
  })
  user?: Partial<User>

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date

  toModel(): types.Token {
    return {
      id: this.id,
      issued: new Date(this.issued),
      expiry: new Date(this.expiry),
      userId: this.userId,
      value: Token.sign(this.value),
    }
  }

  static async saveFromModel(
    model: types.Token
  ): Promise<types.Token> {
    const tokenRepo = getRepository<Token>('Token')

    const jwtoken = jwt.sign(
      {
        uid: model.userId,
        iat: Math.floor(model.issued.getTime() / 1000),
        exp: Math.floor(model.expiry.getTime() / 1000),
      },
      keys.jwtSecret
    )

    let token = Token.create()
    token.issued = model.issued
    token.expiry = model.expiry
    token.userId = model.userId
    token.value = Token.unsign(jwtoken)

    token = await token.save()

    return await token.toModel()
  }

  static sign(value: string): string {
    const decoded = jwt.decode(`${value}.x`)
    if (decoded) {
      const signed = jwt.sign(decoded, keys.jwtSecret)
      return signed
    }
    return ''
  }

  static unsign(value: string): string {
    const pieces = value.split('.')
    const unsigned = `${pieces[0]}.${pieces[1]}`
    return unsigned
  }
}
