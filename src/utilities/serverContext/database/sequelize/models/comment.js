import Sequelize from 'sequelize'


const comment = (sequelize, DataTypes) => {
  const Comment = sequelize.define('comment', {

    _id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },

    content: { type: DataTypes.TEXT, allowNull: false },
    created: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  })

  Comment.buildAssociations = models => {
    Comment.belongsTo(models.Product)
    Comment.belongsTo(models.Post)
    Comment.belongsTo(models.Blog)
    Comment.belongsTo(models.Comment)
    Comment.hasMany(models.Comment, { as: 'replies' })
    Comment.belongsTo(models.User, { as: 'author' })
  }

  return Comment
}

export default comment
