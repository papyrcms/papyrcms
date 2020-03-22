import { NextApiRequest, NextApiResponse } from 'next'

import mongoose from 'mongoose'
import keys from '../../config/keys'

export default async (req: NextApiRequest, res: NextApiResponse & Res, next: Function) => {
  const mongooseConfig = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  }
  await mongoose.connect(keys.mongoURI, mongooseConfig)
  mongoose.plugin((schema: any) => {
    schema.options.usePushEach = true
  })

  return next()
}
