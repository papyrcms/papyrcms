import 'reflect-metadata'
import path from 'path'
import { createConnection, FindConditions } from 'typeorm'
import { __prod__ } from '../../../constants'
import keys from '@/keys'
import * as types from '@/types'
import * as entities from './entities'
import { PapyrEntity } from './entities/PapyrEntity'
import { Connection } from 'typeorm'

export const init = async (): Promise<Connection> => {
  // For backwards compatibility
  if (keys.mongoURI && (!keys.databaseURI || !keys.databaseDriver)) {
    const depricationNotice =
      'MONGO_URI/mongoURI is deprecated. Please set the DATABASE_DRIVER/databaseDriver to "mongodb" and change the variable name MONGO_URI/mongoURI to DATABASE_URI/databaseURI'
    console.warn(depricationNotice)

    keys.databaseDriver = 'mongodb'
    keys.databaseURI = keys.mongoURI
  }

  return await createConnection({
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
  [EntityType.Blog]: entities.Blog,
  [EntityType.Comment]: entities.Comment,
  [EntityType.Event]: entities.Event,
  [EntityType.Message]: entities.Message,
  [EntityType.Order]: entities.Order,
  [EntityType.Page]: entities.Page,
  [EntityType.Post]: entities.Post,
  [EntityType.Product]: entities.Product,
  [EntityType.Settings]: entities.Settings,
  [EntityType.User]: entities.User,
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
): Promise<number | undefined> => {
  const entity = EntityMap[entityType]
  return await entity.count(conditions ?? {})
}
