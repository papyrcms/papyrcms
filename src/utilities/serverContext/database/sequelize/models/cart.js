const cart = (sequelize, DataTypes) => {
  const Cart = sequelize.define('cart', {

    _id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },

    userId: { type: DataTypes.UUID },
    productId: { type: DataTypes.UUID }
    
  }, {
    freezeTableName: true
  })

  Cart.buildAssociations = models => {
    Cart.belongsTo(models.User)
    Cart.belongsTo(models.Product)
  }

  return Cart
}

export default cart