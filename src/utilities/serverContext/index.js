import useSettings from './useSettings'
import database from './database'
import authorization from './authorization'


export default async (req, res) => {

  await database.init()
  const user = await authorization(req, database)
  const settings = await useSettings(database)

  // A common wrap-up function
  const done = async (status, data) => {
    return res.status(status).send(data)
  }

  return { user, settings, database, done }
}
