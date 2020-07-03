import Sequelize from 'sequelize'


const message = (sequelize, DataTypes) => {
  const Message = sequelize.define('message', {

    _id: {
      type: DataTypes.UUID,
      default: DataTypes.UUIDV1,
      primaryKey: true
    },

    name: { type: DataTypes.TEXT, allowNull: false },
    email: { type: DataTypes.TEXT, allowNull: false },
    message: { type: DataTypes.TEXT, allowNull: false },
    emailSent: { type: DataTypes.BOOLEAN, default: false },
    created: { type: DataTypes.DATE, default: DataTypes.NOW },
  })

  return Message
}


export default message
