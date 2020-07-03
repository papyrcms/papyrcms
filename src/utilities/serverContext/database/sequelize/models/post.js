import Sequelize from 'sequelize'


const post = (sequelize, DataTypes) => {
  const Post = sequelize.define('post', {

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
  
    // comments: [{
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'comment'
    // }]
  })

  return Post
}


export default post
