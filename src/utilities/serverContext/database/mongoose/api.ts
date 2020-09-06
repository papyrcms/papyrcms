import mongoose from 'mongoose'
import _ from 'lodash'
import keys from '../../../../config/keys'

export const init = async () => {
  if (mongoose.connection.readyState !== 1) {
    console.log('Connecting to Mongo DB')
    const mongooseConfig = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    }
    await mongoose.connect(keys.databaseURI, mongooseConfig)
    mongoose.plugin((schema: any) => {
      schema.options.usePushEach = true
    })
  }
}

type MonModel = {
  new (...args: any): MonModel
  save: Function
  find: Function
  findOne: Function
  estimatedDocumentCount: Function
  findOneAndUpdate: Function
  findOneAndDelete: Function
  deleteMany: Function
}

type Fields = {
  [key: string]: any
}

type Conditions = {
  [key: string]: any
}

type Options = {
  sort?: { [key: string]: -1 | 1 }
  include?: string[]
}

export const create = async (Model: MonModel, fields: Fields) => {
  const record = new Model(fields)
  await record.save()
  return record
}

export const findOne = async (
  Model: MonModel,
  conditions: Conditions,
  options: Options = {}
) => {
  const record = Model.findOne(conditions)

  if (options.include) {
    _.forEach(options.include, (inclusion) => {
      record.populate(inclusion)
    })
    if (options.include.includes('comments')) {
      record.populate({
        path: 'comments',
        populate: { path: 'author' },
      })
    }
  }

  return await record.exec()
}

export const findAll = async (
  Model: MonModel,
  conditions: Conditions = {},
  options: Options = {}
) => {
  const records = Model.find(conditions)

  if (options.sort) {
    records.sort(options.sort)
  }

  if (options.include) {
    _.forEach(options.include, (inclusion) => {
      records.populate(inclusion)
    })
    if (options.include.includes('comments')) {
      records.populate({
        path: 'comments',
        populate: { path: 'author' },
      })
    }
  }

  return await records.exec()
}

export const countAll = async (Model: MonModel) => {
  return await Model.estimatedDocumentCount()
}

export const update = async (Model: MonModel, conditions: Conditions, fields: Fields) => {
  await Model.findOneAndUpdate(conditions, fields)
}

export const destroy = async (Model: MonModel, conditions: Conditions) => {
  await Model.findOneAndDelete(conditions)
}

export const destroyAll = async (Model: MonModel, conditions: Conditions = {}) => {
  await Model.deleteMany(conditions)
}
