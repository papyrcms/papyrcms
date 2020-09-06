const post = (sequelize: any, DataTypes: any) => {
  const Post = sequelize.define('post', {

    _id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },

    title: { type: DataTypes.TEXT },
    slug: { type: DataTypes.TEXT },
    content: { type: DataTypes.TEXT },
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
  })

  Post.buildAssociations = (models: any) => {
    Post.hasMany(models.Comment)
  }

  return Post
}


export default post
