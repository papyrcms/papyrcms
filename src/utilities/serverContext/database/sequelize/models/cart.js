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

  return Cart
}

export default cart