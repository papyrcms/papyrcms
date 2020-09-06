const order = (sequelize: any, DataTypes: any) => {
  const Order = sequelize.define('order', {

    _id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },

    created: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },

    notes: { type: DataTypes.TEXT },
    shipped: { type: DataTypes.BOOLEAN, defaultValue: false }
  })

  Order.buildAssociations = (models: any) => {
    Order.hasMany(models.Product)
    Order.hasOne(models.User)
  }

  return Order
}


export default order
