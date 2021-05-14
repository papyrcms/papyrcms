import { NextApiRequest, NextApiResponse } from 'next'
import serverContext from '@/serverContext'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { done, database } = await serverContext(req, res)

  if (req.headers.authorization?.toLowerCase().includes('bearer ')) {
    const [_, jwt] = req.headers.authorization.split(' ')
    const [one, two] = jwt.split('.')
    const { EntityType, findOne, destroy } = database
    const token = await findOne(EntityType.Token, {
      value: `${one}.${two}`,
    })
    if (token) await destroy(EntityType.Token, token)
  }

  return await done(200, { message: 'logged out' })
}
