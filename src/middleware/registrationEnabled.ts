import { NextApiRequest, NextApiResponse } from 'next'

export default (req: NextApiRequest & Req, res: NextApiResponse & Res, next: Function) => {
  if (res.locals.settings.enableRegistration || (req.user && req.user.isAdmin)) {
    return next()
  } else {
    return res.status(403).send({ message: "You are not allowed to do that." })
  }
}
