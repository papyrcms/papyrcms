import mongoose from 'mongoose'
import _ from 'lodash'
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


export const create = async (Model, fields) => {

  const record = new Model(fields)
  await record.save()
  return record
}


export const findOne = async (Model, conditions, options = {}) => {

  const record = Model.findOne(conditions)

  if (options.include) {
    _.forEach(options.include, inclusion => {
      record.populate(inclusion)
    })
  }

  return await record.exec()
}


export const findAll = async (Model, conditions = {}, options = {}) => {

  const records = Model.find(conditions)

  if (options.sort) {
    records.sort(options.sort)
  }

  if (options.include) {
    _.forEach(options.include, inclusion => {
      records.populate(inclusion)
    })
  }

  return await records.exec()
}


export const countAll = async (Model) => {
  return await Model.estimatedDocumentCount()
}


export const update = async (Model, conditions, fields) => {
  await Model.findOneAndUpdate(conditions, fields)
}


export const destroy = async (Model, conditions) => {
  await Model.findOneAndDelete(conditions)
}


export const destroyAll = async (Model, conditions = {}) => {
  await Model.deleteMany(conditions)
}
