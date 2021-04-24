import { AppSettings } from '@/types'
import { NextApiRequest, NextApiResponse } from 'next'
import getSettings from './getSettings'
import authorization from './authorization'
import * as database from './database'

// let numConnections = 0
// console.log('memory', numConnections)

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // if (['/api/users', '/api/messages'].includes(req.url as string))
  //   debugger

  // numConnections++
  // console.log('open', numConnections, req.url)
  const connection = await database.init()
  if (!connection.isConnected) {
    throw new Error('Problem connecting to DB')
  }

  // A common wrap-up function
  const done = async (status: number, data: any) => {
    // numConnections--
    // console.log('close', numConnections, req.url)
    // if (numConnections === 0) {
    //   // await connection.close()
    // }
    if (data?.password) delete data.password
    return res.status(status).send(data)
  }

  const user = await authorization(req, database)
  const settings = (await getSettings(database)) as AppSettings

  return { user, settings, database, done }
}
