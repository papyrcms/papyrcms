import Sequelize from 'sequelize'


const blog = (sequelize, DataTypes) => {
  const Blog = sequelize.define('blog', {

    _id: {
      type: DataTypes.UUID,
      default: DataTypes.UUIDV1,
      primaryKey: true
    },

    title: { type: DataTypes.TEXT, notEmpty: true },
    slug: { type: DataTypes.TEXT, notEmpty: true },
    content: { type: DataTypes.TEXT, notEmpty: true },
    tags: { type: DataTypes.TEXT },
    mainMedia: { type: DataTypes.TEXT },
    subImages: { type: DataTypes.TEXT },
    published: { type: DataTypes.BOOLEAN, default: false },
    created: { type: DataTypes.DATE, default: DataTypes.NOW },

    publishDate: { type: DataTypes.DATE },
    // comments: [{
    //   type: DataTypes.UUIDV1,
    //   references: {
    //     model: Product,
    //     key: _id
    //   }
    // }]
  })

  return Blog
}


export default blog
