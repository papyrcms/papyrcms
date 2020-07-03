import Sequelize from 'sequelize'

const product = (sequelize, DataTypes) => {
  const Product = sequelize.define('product', {

    _id: {
      type: DataTypes.UUID,
      default: DataTypes.UUIDV1,
      primaryKey: true
    },

    title: DataTypes.STRING,
    slug: DataTypes.STRING,
    content: DataTypes.STRING,
    tags: [DataTypes.STRING],
    mainMedia: DataTypes.STRING,
    subImages: [DataTypes.STRING],
    published: { type: DataTypes.BOOLEAN, default: false },
    created: { type: DataTypes.DATE, default: DataTypes.NOW },

    price: { type: DataTypes.DOUBLE, allowNull: false },
    quantity: { type: DataTypes.DOUBLE, default: 0 }
  })

  return Product
}

export default product
