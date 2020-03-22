import { NextApiRequest, NextApiResponse } from 'next'

export default (req: NextApiRequest & Req, res: NextApiResponse & Res, next: Function) => {
  if (req.user && req.user.isBanned) {
    req.logout()
    return res.status(401).send({ message: "Your account has been banned." })
  } else {
    return next()
  }
}
