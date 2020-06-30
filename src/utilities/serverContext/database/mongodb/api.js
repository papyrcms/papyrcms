import mongoose from 'mongoose'
import keys from '@/keys'


export const init = async () => {
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


export const findOne = async (Model, conditions, options) => {

  let record = await Model.findOne(conditions)

  if (options.include) {
    for (const inclusion of options.include) {
      record.populate(inclusion).execPopulate()
    }
  }

  return record
}