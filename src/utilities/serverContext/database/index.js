import * as mongooseModels from './mongodb/models'
import * as mongooseApi from './mongodb/api'

const driver = 'mongodb'

let database = null

switch (driver) {
  case 'mongodb':
    database = {
      ...mongooseModels,
      ...mongooseApi
    }
    break

  default: break
}

export default database
