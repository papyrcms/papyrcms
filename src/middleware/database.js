import mongoose from 'mongoose'
import keys from '../config/keys'

export default async (req, res, next) => {
  const mongooseConfig = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  }
  await mongoose.connect(keys.mongoURI, mongooseConfig)
  mongoose.plugin(schema => {
    schema.options.usePushEach = true
  })

  return next()
}
