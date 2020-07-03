import Sequelize from 'sequelize'


const comment = (sequelize, DataTypes) => {
  const Comment = sequelize.define('blog', {

    _id: {
      type: DataTypes.UUID,
      default: DataTypes.UUIDV1,
      primaryKey: true
    },

    content: { type: DataTypes.TEXT, allowNull: false },
    // replies: [{
    //   type: DataTypes.UUIDV1,
    //   references: {
    //     model: Comment,
    //     key: _id
    //   }
    // }],
    created: { type: DataTypes.DATE, default: DataTypes.NOW },
    // author: {
    //   type: DataTypes.UUIDV1,
    //   references: {
    //     model: User,
    //     key: _id
    //   }
    // }
  })
}

export default comment
