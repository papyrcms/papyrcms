import 'reflect-metadata'
import path from 'path'
import { createConnection, FindConditions } from 'typeorm'
import { __prod__ } from '../../../constants'
import keys from '@/keys'
import * as types from '@/types'
import * as entities from './entities'
import { PapyrEntity } from './entities/PapyrEntity'

export const init = async () => {
  // For backwards compatibility
  if (keys.mongoURI && (!keys.databaseURI || !keys.databaseDriver)) {
    const depricationNotice =
      'MONGO_URI/mongoURI is deprecated. Please set the DATABASE_DRIVER/databaseDriver to "mongodb" and change the variable name MONGO_URI/mongoURI to DATABASE_URI/databaseURI'
    console.warn(depricationNotice)

    keys.databaseDriver = 'mongodb'
    keys.databaseURI = keys.mongoURI
  }

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

// TODO - Not a fan of how this works. Not sure there's a better way
const getEntityFromModel = (
  model: types.DbModel
): typeof PapyrEntity | undefined => {
  switch (true) {
    case model instanceof types.Blog:
      return entities.Blog
    case model instanceof types.Comment:
      return entities.Comment
    case model instanceof types.Event:
      return entities.Event
    case model instanceof types.Message:
      return entities.Message
    case model instanceof types.Order:
      return entities.Order
    case model instanceof types.Page:
      return entities.Page
    case model instanceof types.Post:
      return entities.Post
    case model instanceof types.Product:
      return entities.Product
    case model instanceof types.Settings:
      return entities.Settings
    case model instanceof types.User:
      return entities.User
  }
}

export const findOne = async (
  model: types.DbModel
): Promise<types.DbModel | undefined> => {
  const entity = getEntityFromModel(model)
  const foundEntity = await entity?.findOne({
    where: { id: model.id },
  })
  return await foundEntity?.toModel()
}

export const findAll = async (
  model: types.DbModel
): Promise<types.DbModel[]> => {
  const entity = getEntityFromModel(model)
  const foundEntities = await entity?.find({
    where: { id: model.id },
  })
  const entityModels: types.DbModel[] = []

  if (!foundEntities) return entityModels

  for (const foundEntity of foundEntities) {
    entityModels.push(await foundEntity.toModel())
  }
  return entityModels
}

/**
 * @deprecated Use save(model) instead
 */
export const create = async (
  model: types.DbModel
): Promise<types.DbModel | undefined> => {
  return await save(model)
}

/**
 * @deprecated Use save(model) instead
 */
export const update = async (
  model: types.DbModel
): Promise<types.DbModel | undefined> => {
  return await save(model)
}

export const save = async (
  model: types.DbModel
): Promise<types.DbModel | undefined> => {
  const entity = getEntityFromModel(model)
  return await entity?.saveFromModel(model)
}

export const destroy = async (
  model: types.DbModel
): Promise<boolean> => {
  const entity = getEntityFromModel(model)
  const foundEntity = await entity?.findOne({
    where: { id: model.id },
  })
  return !!(await foundEntity?.remove())
}

export const destroyAll = async (
  model: types.DbModel,
  conditions?: FindConditions<PapyrEntity>
): Promise<boolean> => {
  const entity = getEntityFromModel(model)
  return !!(await entity?.delete(conditions || {}))
}

export const countAll = async (
  model: types.DbModel,
  conditions?: FindConditions<PapyrEntity>
): Promise<number | undefined> => {
  const entity = getEntityFromModel(model)
  return await entity?.count(conditions || {})
}
