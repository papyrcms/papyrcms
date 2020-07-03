import Sequelize from 'sequelize'
import _ from 'lodash'
import keys from '../../../../config/keys'


export const init = async () => {
  console.log('Connecting to Sequelize DB')
  const sequelize = new Sequelize(keys.databaseURI, {
    dialect: keys.databaseDriver,
    logging: false
  })

  
}


export const create = async (Model, fields) => {

}


export const findOne = async (Model, conditions, options = {}) => {


  
  if (options.include) {
    _.forEach(options.include, inclusion => {

    })
    if (options.include.includes('comments')) {

    }
  }

  return
}


export const findAll = async (Model, conditions = {}, options = {}) => {


  
  if (options.sort) {

  }

  if (options.include) {
    _.forEach(options.include, inclusion => {

    })
    if (options.include.includes('comments')) {

    }
  }

  return
}


export const countAll = async (Model) => {

}


export const update = async (Model, conditions, fields) => {

}


export const destroy = async (Model, conditions) => {

}


export const destroyAll = async (Model, conditions = {}) => {

}
