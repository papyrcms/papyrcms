import { Database, User, Settings } from 'types'
import { NextApiRequest, NextApiResponse } from 'next'
import useSettings from './useSettings'
import initDatabase from './database'
import authorization from './authorization'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const database: Database = await initDatabase()
  const user: User | null = await authorization(req, database)
  const settings: Settings = await useSettings(database)

  // A common wrap-up function
  const done = async (status: number, data: { [key: string]: any }) => {
    return res.status(status).send(data)
  }

  return { user, settings, database, done }
}
