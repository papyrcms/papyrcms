import { AppSettings } from '@/types'
import { NextApiRequest, NextApiResponse } from 'next'
import useSettings from './useSettings'
import authorization from './authorization'
import * as database from './database'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const connection = await database.init()
  const user = await authorization(req, database)
  const settings = (await useSettings(database)) as AppSettings

  // A common wrap-up function
  const done = async (status: number, data: any) => {
    await connection.close()
    return res.status(status).send(data)
  }

  return { user, settings, database, done }
}
