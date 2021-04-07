import 'reflect-metadata'
import path from 'path'
import { createConnection } from 'typeorm'
import { __prod__ } from '../../../constants'
import keys from '@/keys'

const init = async () => {
  const entityPath = keys.databaseDriver === 'mongodb' ? 'mongo' : ''

  await createConnection({
    type: keys.databaseDriver,
    url: keys.databaseURI,
    synchronize: true,
    logging: !__prod__,
    entities: [path.join(__dirname, entityPath, '*.js')],
    migrations: [],
    subscribers: [],
    extra: {
      ssl: __prod__,
      rejectUnauthorized: !__prod__,
    },
  })
}
