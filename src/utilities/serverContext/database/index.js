import keys from '../../../config/keys'
import * as mongooseModels from './mongoose/models'
import * as mongooseApi from './mongoose/api'
import * as sequelizeApi from './sequelize/api'

export default async () => {

  let database

  switch (keys.databaseDriver) {
    
    // We use Mongoose for this
    case 'mongodb':
      await mongooseApi.init()
      database = {
        ...mongooseModels,
        ...mongooseApi
      }
      break

    // We use Sequelize for this
    case 'postgres':
      const sequelizeModels = await sequelizeApi.init()
      database = {
        ...sequelizeModels,
        ...sequelizeApi
      }
      break

    default: throw new Error('You need a valid database driver.')
  }

  return database
}