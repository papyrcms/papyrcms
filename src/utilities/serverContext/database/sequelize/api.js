import Sequelize from 'sequelize'
import _ from 'lodash'
import keys from '../../../../config/keys'
import * as models from './models'


export const init = async () => {

  console.log('Connecting to Sequelize DB')
  const sequelize = new Sequelize(keys.databaseURI, {
    logging: false
  })

  const initializedModels = {}
  _.forEach(models, model => {
    const modelName = model.name.charAt(0).toUpperCase() + model.name.slice(1)
    initializedModels[modelName] = model(sequelize, Sequelize)
  })

  _.forEach(initializedModels, model => {
    if (model.buildAssociations) {
      model.buildAssociations(initializedModels)
    }
  })

  await sequelize.sync()

  return { ...initializedModels }
}


export const create = async (Model, fields) => {
  if (Model.name === 'comment') {
    fields.authorId = fields.author._id
  }
  return await Model.create(fields)
}


export const findOne = async (Model, conditions, options = {}) => {

  const query = {
    where: conditions
  }
  
  if (options.include) {
    query.include = []
    _.forEach(options.include, inclusion => {
      if (inclusion !== 'cart') {
        const connectedModel = Model.associations[inclusion].target
        const inclusionQuery = {
          model: connectedModel,
          as: inclusion,
          required: false
        }
        if (inclusion === 'comments') {
          inclusionQuery.include = [{
            model: connectedModel.associations.author.target,
            required: false,
            as: 'author'
          }]
        }
        query.include.push(inclusionQuery)
      }
    })
  }

  const instance = await Model.findOne(query)

  return instance
}


export const findAll = async (Model, conditions = {}, options = {}) => {

  const query = {
    where: conditions
  }
  
  if (options.sort) {
    query.order = _.map(options.sort, (value, key) => {
      value = value < 0 ? 'DESC' : 'ASC'
      return [key, value]
    })
  }

  if (options.include) {
    query.include = []
    _.forEach(options.include, inclusion => {
      if (inclusion !== 'cart') {
        const connectedModel = Model.associations[inclusion].target
        const inclusionQuery = {
          model: connectedModel,
          as: inclusion,
          required: false
        }
        if (inclusion === 'comments') {
          inclusionQuery.include = [{
            model: connectedModel.associations.author.target,
            required: false,
            as: 'author'
          }]
        }
        query.include.push(inclusionQuery)
      }
    })
  }

  let records = await Model.findAll(query)

  return records
}


export const countAll = async (Model) => {
  return await Model.count()
}


export const update = async (Model, conditions, fields) => {

  _.forEach(fields, async (value, key) => {
    if (key === 'comments') {
      const modelType = Model.name
      const instance = await Model.findOne({ where: conditions })
      _.forEach(value, async comment => {
        if (!comment[`${modelType}Id`]) {
          await comment.update({ [`${modelType}Id`]: instance._id })
        }
      })
    }
  })

  await Model.update(fields, { where: conditions })
}


export const destroy = async (Model, conditions) => {
  await Model.destroy({
    where: conditions
  })
}


export const destroyAll = async (Model, conditions = {}) => {
  await Model.destroy({
    where: conditions
  })
}
