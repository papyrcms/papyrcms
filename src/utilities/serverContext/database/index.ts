import 'reflect-metadata'
import { createConnection, getConnection } from 'typeorm'
import { __prod__ } from '../../../constants'
import keys from '@/keys'
import * as types from '@/types'
import { Connection } from 'typeorm'
import { PapyrEntity } from './entities/PapyrEntity'
import { Message } from './entities/Message'
import { Post } from './entities/Post'
import { Event } from './entities/Event'
import { User } from './entities/User'
import { Comment } from './entities/Comment'
import { Blog } from './entities/Blog'
import { Order } from './entities/Order'
import { Option } from './entities/Option'
import { Section } from './entities/Section'
import { Page } from './entities/Page'
import { Product } from './entities/Product'
import { Settings } from './entities/Settings'
import { OrderedProduct } from './entities/OrderedProduct'
import { CartProduct } from './entities/CartProduct'

// let connectionReadyPromise
// const context = require.context(
//   'src/utilities/serverContext/database/entities'
// )
// const entityFileNames = context.keys()
// const entities = entityFileNames.map((file) => context(file).default)

export const init = async (): Promise<Connection> => {
  // For backwards compatibility
  if (keys.mongoURI && (!keys.databaseURI || !keys.databaseDriver)) {
    const depricationNotice =
      'MONGO_URI/mongoURI is deprecated. Please set the DATABASE_DRIVER/databaseDriver to "mongodb" and change the variable name MONGO_URI/mongoURI to DATABASE_URI/databaseURI'
    console.warn(depricationNotice)

    keys.databaseDriver = 'mongodb'
    keys.databaseURI = keys.mongoURI
  }

  // try {
  //   const staleConnection = getConnection()
  //   await staleConnection.close()
  // } catch (error) {
  //   // no stale connection to clean up
  // }

  const connection = await createConnection({
    type: keys.databaseDriver,
    url: keys.databaseURI,
    synchronize: true,
    logging: false, //!__prod__,
    // entities,
    entities: [
      Message,
      Post,
      Event,
      User,
      Comment,
      Blog,
      Order,
      Option,
      Section,
      Page,
      Product,
      Settings,
      OrderedProduct,
      CartProduct,
    ],
    migrations: [],
    subscribers: [],
    extra: {
      ssl: __prod__,
      rejectUnauthorized: !__prod__,
    },
  })

  // connectionReadyPromise = connection

  return connection
}

export enum EntityType {
  Blog,
  Comment,
  Event,
  Message,
  Order,
  Page,
  Post,
  Product,
  Settings,
  User,
}

const EntityMap: Record<EntityType, typeof PapyrEntity> = {
  [EntityType.Blog]: Blog,
  [EntityType.Comment]: Comment,
  [EntityType.Event]: Event,
  [EntityType.Message]: Message,
  [EntityType.Order]: Order,
  [EntityType.Page]: Page,
  [EntityType.Post]: Post,
  [EntityType.Product]: Product,
  [EntityType.Settings]: Settings,
  [EntityType.User]: User,
}

// Might need this later
const ModelMap: Record<EntityType, typeof types.DbModel> = {
  [EntityType.Blog]: types.Blog,
  [EntityType.Comment]: types.Comment,
  [EntityType.Event]: types.Event,
  [EntityType.Message]: types.Message,
  [EntityType.Order]: types.Order,
  [EntityType.Page]: types.Page,
  [EntityType.Post]: types.Post,
  [EntityType.Product]: types.Product,
  [EntityType.Settings]: types.Settings,
  [EntityType.User]: types.User,
}

export const findOne = async <M extends types.DbModel>(
  entityType: EntityType,
  conditions: Record<string, any>
): Promise<M | undefined> => {
  const entity = EntityMap[entityType]
  const foundEntity = await entity.findOne({
    where: conditions,
  })
  return (await foundEntity?.toModel()) as M
}

export const findAll = async <M extends types.DbModel>(
  entityType: EntityType,
  conditions?: Record<string, any>
): Promise<M[]> => {
  const entity = EntityMap[entityType]
  const foundEntities = await entity.find({
    where: conditions ?? {},
  })
  const entityModels: M[] = []

  if (!foundEntities) return entityModels

  for (const foundEntity of foundEntities) {
    entityModels.push((await foundEntity.toModel()) as M)
  }
  return entityModels
}

export const save = async <M extends types.DbModel>(
  entityType: EntityType,
  model: types.DbModel
): Promise<M | undefined> => {
  const entity = EntityMap[entityType]
  return (await entity.saveFromModel(model)) as M
}

export const destroy = async (
  entityType: EntityType,
  model: types.DbModel
): Promise<boolean> => {
  const entity = EntityMap[entityType]
  const foundEntity = await entity.findOne({
    where: { id: model.id },
  })
  return !!(await foundEntity?.remove())
}

export const destroyAll = async (
  entityType: EntityType,
  conditions?: Record<string, any>
): Promise<boolean> => {
  const entity = EntityMap[entityType]
  return !!(await entity.delete(conditions ?? {}))
}

export const countAll = async (
  entityType: EntityType,
  conditions?: Record<string, any>
): Promise<number> => {
  const entity = EntityMap[entityType]
  return await entity.count(conditions ?? {})
}
