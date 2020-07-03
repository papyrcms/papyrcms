import Sequelize from 'sequelize'


const event = (sequelize, DataTypes) => {
  const Event = sequelize.define('event', {

    _id: {
      type: DataTypes.UUID,
      default: DataTypes.UUIDV1,
      primaryKey: true
    },

    title: { type: DataTypes.TEXT, allowNull: false },
    slug: { type: DataTypes.TEXT, allowNull: false },
    content: { type: DataTypes.TEXT },
    tags: { type: DataTypes.TEXT },
    mainMedia: { type: DataTypes.TEXT },
    subImages: { type: DataTypes.TEXT },
    published: { type: DataTypes.BOOLEAN, default: false },
    created: { type: DataTypes.DATE, default: DataTypes.NOW },
  
    date: { type: DataTypes.DATE, allowNull: false },
    latitude: { type: DataTypes.DOUBLE },
    longitude: { type: DataTypes.DOUBLE }
  })

  return Event
}


export default event
