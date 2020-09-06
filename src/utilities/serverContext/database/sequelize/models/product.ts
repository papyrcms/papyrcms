const product = (sequelize: any, DataTypes: any) => {
  const Product = sequelize.define('product', {
    _id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },

    title: { type: DataTypes.TEXT },
    slug: { type: DataTypes.TEXT },
    content: { type: DataTypes.TEXT },
    tags: {
      type: DataTypes.TEXT,
      defaultValue: '[]',
      get() {
        // @ts-ignore
        const rawValue: string = this.getDataValue('tags')
        return JSON.parse(rawValue)
      },
      set(value: string[]) {
        // @ts-ignore
        this.setDataValue('tags', JSON.stringify(value))
      },
    },
    mainMedia: { type: DataTypes.TEXT },
    subImages: {
      type: DataTypes.TEXT,
      defaultValue: '[]',
      get() {
        // @ts-ignore
        const rawValue: string = this.getDataValue('subImages')
        return JSON.parse(rawValue)
      },
      set(value: string[]) {
        // @ts-ignore
        this.setDataValue('subImages', JSON.stringify(value))
      },
    },
    published: { type: DataTypes.BOOLEAN, defaultValue: false },
    created: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },

    price: { type: DataTypes.DOUBLE, allowNull: false },
    quantity: { type: DataTypes.DOUBLE, defaultValue: 0 },
  })

  Product.buildAssociations = (models: any) => {
    Product.hasMany(models.Comment)
    Product.belongsTo(models.Order)
    Product.hasMany(models.Cart)
  }

  return Product
}

export default product
