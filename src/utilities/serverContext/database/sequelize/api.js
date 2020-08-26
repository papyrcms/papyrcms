import Sequelize from 'sequelize'
import _ from 'lodash'
import keys from '../../../../config/keys'
import * as models from './models'


export const init = async () => {

  // console.log('Connecting to Sequelize DB')
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

      // If the inclusion is "cart"
      } else {

        const cartModel = Model.sequelize.models.cart
        const productModel = Model.sequelize.models.product

        const inclusionQuery = {
          model: cartModel,
          required: false,
          include: [{
            model: productModel
          }]
        }
        query.include.push(inclusionQuery)
      }
    })
  }

  const instance = await Model.findOne(query)

  // If the instance is a user with "carts", make the cart
  if (Model.name === 'user' && instance && instance.carts) {
    instance.cart = _.map(instance.carts, connection => connection.product)
    instance.dataValues.cart = instance.cart
  }
  
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

      // If the inclusion is "cart"
      } else {

        const cartModel = Model.sequelize.models.cart
        const productModel = Model.sequelize.models.product

        const inclusionQuery = {
          model: cartModel,
          required: false,
          include: [{
            model: productModel
          }]
        }
        query.include.push(inclusionQuery)
      }
    })
  }

  let records = await Model.findAll(query)

  // If the instance is a user with "products", make the cart
  if (Model.name === 'user' && records) {
    records = _.map(records, instance => {
      if (instance.carts) {
        instance.cart = _.map(instance.carts, connection => connection.product)
        instance.dataValues.cart = instance.cart
      }
      return instance
    })
  }

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

    if (key === 'cart') {

      const cartModel = Model.sequelize.models.cart
      const productModel = Model.sequelize.models.product

      const query = {
        where: conditions,
        include: [{
          model: cartModel,
          required: false,
          include: [{
            model: productModel
          }]
        }]
      }
      const user = await Model.findOne(query)
      user.cart = _.map(user.carts, connection => connection.product)

      // If we are adding to cart
      if (!user.cart || user.cart.length < value.length) {

        // Set an object where key is the id and value is the 
        // quantity of that product in the cart
        const productIds = {}

        // Populate the object
        _.forEach(user.cart, product => {
          if (!productIds[product._id]) {
            productIds[product._id] = 0
          }
          productIds[product._id]++
        })

        // Use the object to determine which ids in "value" are new
        const newProducts = _.filter(value, product => {
          if (productIds[product._id]) {
            productIds[product._id]--
            return false
          }
          return true
        })

        // Add the new ids to the cart table
        _.forEach(newProducts, async product => {
          await cartModel.create({ productId: product._id, userId: user._id })
        })

      // If we are removing from cart
      } else {

        // Set an object where key is the id and value is the 
        // quantity of that product in the cart
        const productIds = {}

        // Populate the object
        _.forEach(value, product => {
          if (!productIds[product._id]) {
            productIds[product._id] = 0
          }
          productIds[product._id]++
        })

        // Use the object to determine which ids in "value" are removed
        const productsToRemove = _.filter(user.cart, product => {
          if (productIds[product._id]) {
            productIds[product._id]--
            return false
          }
          return true
        })

        // Remove the items from the cart table
        _.forEach(productsToRemove, async product => {
          await cartModel.destroy({ 
            where: {
              productId: product._id,
              userId: user._id
            },
            limit: 1
          })
        })
      }
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
