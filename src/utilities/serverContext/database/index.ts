import 'reflect-metadata'
import {
  Connection,
  getConnectionManager,
  getRepository,
} from 'typeorm'
import { __prod__ } from '../../../constants'
import keys from '../../../config/keys'
import * as types from '../../../types'
import * as entities from './entities'
import { PapyrEntity } from './entities/PapyrEntity'

export const init = async (
  connectionName: string = 'default'
): Promise<Connection> => {
  // For backwards compatibility
  if (keys.mongoURI && (!keys.databaseURI || !keys.databaseDriver)) {
    const depricationNotice =
      'MONGO_URI/mongoURI is deprecated. Please set the DATABASE_DRIVER/databaseDriver to "mongodb" and change the variable name MONGO_URI/mongoURI to DATABASE_URI/databaseURI'
    console.warn(depricationNotice)

    keys.databaseDriver = 'mongodb'
    keys.databaseURI = keys.mongoURI
  }

  const connectionOptions = {
    name: connectionName,
    type: keys.databaseDriver,
    url: keys.databaseURI,
    synchronize: true,
    logging: false, // !__prod__,
    entities: Object.values(entities),
    migrations: [],
    subscribers: [],
    extra: {
      ssl: __prod__,
      rejectUnauthorized: !__prod__,
    },
  }

  const connectionManager = getConnectionManager()
  if (connectionManager.has(connectionName)) {
    const connection = connectionManager.get(connectionName)

    if (!connection.isConnected) {
      await connection.connect()
    }

    if (!__prod__) {
      await updateConnectionEntities(
        connection,
        connectionOptions.entities
      )
    }

    return connection
  }

  return await connectionManager.create(connectionOptions).connect()
}

const updateConnectionEntities = async (
  connection: Connection,
  entities: any[]
) => {
  if (!entitiesChanged(connection.options.entities || [], entities))
    return

  // @ts-ignore
  connection.options.entities = entities

  // @ts-ignore
  connection.buildMetadatas()

  if (connection.options.synchronize) {
    await connection.synchronize()
  }
}

const entitiesChanged = (prevEntities: any[], newEntities: any[]) => {
  if (prevEntities.length !== newEntities.length) return true
  for (let i = 0; i < prevEntities.length; i++) {
    if (prevEntities[i] !== newEntities[i]) return true
  }
  return false
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

export const findOne = async <M extends types.DbModel>(
  entityType: EntityType,
  conditions: Record<string, any>
): Promise<M | undefined> => {
  const repository = getRepository(EntityType[entityType])
  const foundEntity = (await repository.findOne({
    where: conditions,
  })) as PapyrEntity
  return (await foundEntity?.toModel()) as M
}

export const findAll = async <M extends types.DbModel>(
  entityType: EntityType,
  conditions?: Record<string, any>
): Promise<M[]> => {
  const repository = getRepository(EntityType[entityType])
  const foundEntities = (await repository.find({
    where: conditions ?? {},
  })) as PapyrEntity[]
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
  const repository = getRepository(EntityType[entityType])
  const foundEntity = (await repository.findOne({
    where: { id: model.id },
  })) as PapyrEntity
  return !!(await foundEntity?.remove())
}

export const destroyAll = async (
  entityType: EntityType,
  conditions?: Record<string, any>
): Promise<boolean> => {
  const repository = getRepository(EntityType[entityType])
  return !!(await repository.delete(conditions ?? {}))
}

export const countAll = async (
  entityType: EntityType,
  conditions?: Record<string, any>
): Promise<number> => {
  const repository = getRepository(EntityType[entityType])
  return await repository.count(conditions ?? {})
}
