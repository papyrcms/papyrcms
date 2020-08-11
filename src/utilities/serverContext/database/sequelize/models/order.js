import Sequelize from 'sequelize'


const order = (sequelize, DataTypes) => {
  const Order = sequelize.define('order', {

    _id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },

    created: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },

    // products: [{
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'product'
    // }],
    // user: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'user'
    // },
    notes: { type: DataTypes.TEXT },
    shipped: { type: DataTypes.BOOLEAN, defaultValue: false }
  })

  Order.buildAssociations = models => {
    Order.hasMany(models.Product)
    Order.hasOne(models.User)
  }

  return Order
}


export default order
