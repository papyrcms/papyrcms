import { AppSettings } from '@/types'
import { NextApiRequest, NextApiResponse } from 'next'
import getSettings from './getSettings'
import authorization from './authorization'
import * as database from './database'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const connection = await database.init()
  if (!connection.isConnected) {
    throw new Error('Problem connecting to DB')
  }

  // A common wrap-up function
  const done = async (status: number, data: any) => {
    if (data?.password) delete data.password
    return res.status(status).send(data)
  }

  const user = await authorization(req, database)
  const settings = (await getSettings(database)) as AppSettings

  return { user, settings, database, done }
}
