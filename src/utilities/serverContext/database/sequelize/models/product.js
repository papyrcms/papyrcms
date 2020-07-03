import Sequelize from 'sequelize'

const product = (sequelize, DataTypes) => {
  const Product = sequelize.define('product', {

    _id: {
      type: DataTypes.UUID,
      default: DataTypes.UUIDV1,
      primaryKey: true
    },

    title: { type: DataTypes.TEXT },
    slug: { type: DataTypes.TEXT },
    content: { type: DataTypes.TEXT },
    tags: {
      type: DataTypes.TEXT,
      get() {
        const rawValue = this.getDataValue(tags)
        return JSON.parse(rawValue)
      },
      set(value) {
        this.setDataValue('tags', JSON.stringify(value))
      }
    },
    mainMedia: { type: DataTypes.TEXT },
    subImages: {
      type: DataTypes.TEXT,
      get() {
        const rawValue = this.getDataValue(subImages)
        return JSON.parse(rawValue)
      },
      set(value) {
        this.setDataValue('subImages', JSON.stringify(value))
      }
    },
    published: { type: DataTypes.BOOLEAN, default: false },
    created: { type: DataTypes.DATE, default: DataTypes.NOW },

    price: { type: DataTypes.DOUBLE, allowNull: false },
    quantity: { type: DataTypes.DOUBLE, default: 0 }
  })

  return Product
}

export default product
