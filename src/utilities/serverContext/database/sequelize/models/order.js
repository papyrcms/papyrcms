import Sequelize from 'sequelize'


const order = (sequelize, DataTypes) => {
  const Order = sequelize.define('order', {

    _id: {
      type: DataTypes.UUID,
      default: DataTypes.UUIDV1,
      primaryKey: true
    },

    created: { type: DataTypes.DATE, default: DataTypes.NOW },

    // products: [{
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'product'
    // }],
    // user: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'user'
    // },
    notes: { type: DataTypes.TEXT },
    shipped: { type: DataTypes.BOOLEAN, default: false }
  })

  return Order
}


export default order
