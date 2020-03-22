import { NextApiRequest, NextApiResponse } from 'next'

export default (req: NextApiRequest & Req, res: NextApiResponse, next: Function) => {
  if (req.user) {
    return next()
  } else {
    return res.status(403).send({ message: 'You must be logged in to do that.' })
  }
}
