const blog = (sequelize: any, DataTypes: any) => {
  const Blog = sequelize.define('blog', {

    _id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },

    title: { type: DataTypes.TEXT, notEmpty: true },
    slug: { type: DataTypes.TEXT, notEmpty: true },
    content: { type: DataTypes.TEXT, notEmpty: true },
    tags: {
      type: DataTypes.TEXT,
      defaultValue: "[]",
      get() {
        // @ts-ignore
        const rawValue: string = this.getDataValue('tags')
        return JSON.parse(rawValue)
      },
      set(value: string[]) {
        // @ts-ignore
        this.setDataValue('tags', JSON.stringify(value))
      }
    },
    mainMedia: { type: DataTypes.TEXT },
    subImages: {
      type: DataTypes.TEXT,
      defaultValue: "[]",
      get() {
        // @ts-ignore
        const rawValue: string = this.getDataValue('subImages')
        return JSON.parse(rawValue)
      },
      set(value: string[]) {
        // @ts-ignore
        this.setDataValue('subImages', JSON.stringify(value))
      }
    },
    published: { type: DataTypes.BOOLEAN, defaultValue: false },
    created: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },

    publishDate: { type: DataTypes.DATE },
  })

  Blog.buildAssociations = (models: any) => {
    Blog.hasMany(models.Comment)
  }

  return Blog
}


export default blog
