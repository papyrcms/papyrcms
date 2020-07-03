import Sequelize from 'sequelize'

const cart = (sequelize, DataTypes) => {
  const Cart = sequelize.define('cart', {

    _id: {
      type: DataTypes.UUID,
      default: DataTypes.UUIDV1,
      primaryKey: true
    },

    userId: { type: DataTypes.UUIDV1 },
    productId: { type: DataTypes.UUIDV1 }
  })

  return Cart
}

export default cart