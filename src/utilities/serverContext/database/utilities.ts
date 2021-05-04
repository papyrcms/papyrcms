import { ObjectId } from 'mongodb'
import {
  Column,
  ColumnOptions,
  ColumnType,
  ObjectIdColumn,
  PrimaryGeneratedColumn,
} from 'typeorm'
import keys from '../../../config/keys'

const mysqlTypeMap: Record<string, ColumnType> = {
  text: 'longtext',
}

export function resolveDbType(type: ColumnType): ColumnType {
  switch (keys.databaseDriver) {
    case 'mysql':
      return mysqlTypeMap[type.toString()] || type
    case 'postgres':
    default:
      return type
  }
}

export function DbAwareColumn(columnOptions: ColumnOptions) {
  if (columnOptions.type) {
    columnOptions.type = resolveDbType(columnOptions.type)
  }
  return Column(columnOptions)
}

export function DbAwarePGC() {
  if (keys.databaseDriver === 'mongodb') {
    return ObjectIdColumn()
  }
  return PrimaryGeneratedColumn('uuid')
}

export function sanitizeConditions(conditions: Record<string, any>) {
  if (conditions.id && keys.databaseDriver === 'mongodb') {
    conditions._id = new ObjectId(conditions.id)
    delete conditions.id
  }
  return conditions
}
