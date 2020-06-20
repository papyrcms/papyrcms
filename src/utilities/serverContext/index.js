import useSettings from './useSettings'
import database from './database'
import authorization from './authorization'


export default async (req, res) => {

  await database()
  const user = await authorization(req)
  const settings = await useSettings()

  // A common wrap-up function
  const done = async (status, data) => {
    return res.status(status).send(data)
  }

  return { user, settings, done }
}
