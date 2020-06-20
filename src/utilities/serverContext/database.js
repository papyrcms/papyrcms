import mongoose from 'mongoose'
import keys from '@/keys'

export default async () => {
  if (mongoose.connection._readyState !== 1) {
    console.log('Connecting to DB')
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
}
