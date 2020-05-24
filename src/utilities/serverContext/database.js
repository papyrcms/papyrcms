import mongoose from 'mongoose'
import keys from '@/keys'

export default async () => {
  const mongooseConfig = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  }
  await mongoose.connect(keys.mongoURI, mongooseConfig)
  mongoose.plugin((schema) => {
    schema.options.usePushEach = true
  })
}
