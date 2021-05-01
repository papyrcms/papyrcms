import keys from '@/keys'
import { Column, ColumnOptions, ColumnType } from 'typeorm'

const mysqlTypeMap: { [key: string]: ColumnType } = {
  text: 'longtext',
}

export function resolveDbType(mySqlType: ColumnType): ColumnType {
  switch (keys.databaseDriver) {
    case 'mysql':
      return mysqlTypeMap[mySqlType.toString()]
    case 'postgres':
    default:
      return mySqlType
  }
}

export function DbAwareColumn(columnOptions: ColumnOptions) {
  if (columnOptions.type) {
    columnOptions.type = resolveDbType(columnOptions.type)
  }
  return Column(columnOptions)
}
