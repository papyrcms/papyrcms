import keys from '../../../config/keys'
import * as mongooseModels from './mongoose/models'
import * as mongooseApi from './mongoose/api'
import * as sequelizeModels from './sequelize/models'
import * as sequelizeApi from './sequelize/api'

let database = null

switch (keys.databaseDriver) {
  
  case 'mongodb':
    database = {
      ...mongooseModels,
      ...mongooseApi
    }
    break

  case 'postgres':
    database = {
      ...sequelizeModels,
      ...sequelizeApi
    }
    break

  default: throw new Error('You need a valid database driver.')
}

export default database
