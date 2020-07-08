import Sequelize from 'sequelize'


const message = (sequelize, DataTypes) => {
  const Message = sequelize.define('message', {

    _id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },

    name: { type: DataTypes.TEXT, allowNull: false },
    email: { type: DataTypes.TEXT, allowNull: false },
    message: { type: DataTypes.TEXT, allowNull: false },
    emailSent: { type: DataTypes.BOOLEAN, defaultValue: false },
    created: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  })

  return Message
}


export default message
