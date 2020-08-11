import keys from '../../../config/keys'
import * as mongooseModels from './mongoose/models'
import * as mongooseApi from './mongoose/api'
import * as sequelizeApi from './sequelize/api'

export default async () => {

  let database

  // For backwards compatibility
  if (
    keys.mongoURI &&
    (
      !keys.databaseURI ||
      !keys.databaseDriver
    )
  ) {
    const depricationNotice = 'MONGO_URI/mongoURI is deprecated. Please set the DATABASE_DRIVER/databaseDriver to "mongodb" and change the variable name MONGO_URI/mongoURI to DATABASE_URI/databaseURI'
    console.warn(depricationNotice)

    keys.databaseDriver = 'mongodb'
    keys.databaseURI = keys.mongoURI
  }

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
    case 'sqlite':
    case 'mysql':
    case 'mariadb':
    case 'mssql':
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