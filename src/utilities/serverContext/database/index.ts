import 'reflect-metadata'
import path from 'path'
import { BaseEntity, createConnection } from 'typeorm'
import { __prod__ } from '../../../constants'
import keys from '@/keys'
import * as types from '@/types'
import * as entities from './entities'

export const init = async () => {
  await createConnection({
    type: keys.databaseDriver,
    url: keys.databaseURI,
    synchronize: true,
    logging: !__prod__,
    entities: [path.join(__dirname, 'entities', '*.ts')],
    migrations: [],
    subscribers: [],
    extra: {
      ssl: __prod__,
      rejectUnauthorized: !__prod__,
    },
  })
}

const entityMap = {
  Blog: entities.Blog,
  Comment: entities.Comment,
  Event: entities.Event,
  Message: entities.Message,
  Order: entities.Order,
  Page: entities.Page,
  Post: entities.Post,
  Product: entities.Product,
  Settings: entities.Settings,
  User: entities.User,
}

export const create = async (
  entity: BaseEntity,
  fields: Record<string, any>
) => {}

export const findOne = async () => {}

export const findAll = async () => {}

export const update = async () => {}

export const destroy = async () => {}

export const destroyAll = async () => {}

export const countAll = async () => {}
