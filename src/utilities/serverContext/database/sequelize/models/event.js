import Sequelize from 'sequelize'


const event = (sequelize, DataTypes) => {
  const Event = sequelize.define('event', {

    _id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },

    title: { type: DataTypes.TEXT, allowNull: false },
    slug: { type: DataTypes.TEXT, allowNull: false },
    content: { type: DataTypes.TEXT },
    tags: {
      type: DataTypes.TEXT,
      get() {
        const rawValue = this.getDataValue('tags')
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
        const rawValue = this.getDataValue('subImages')
        return JSON.parse(rawValue)
      },
      set(value) {
        this.setDataValue('subImages', JSON.stringify(value))
      }
    },
    published: { type: DataTypes.BOOLEAN, defaultValue: false },
    created: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  
    date: { type: DataTypes.DATE, allowNull: false },
    latitude: { type: DataTypes.DOUBLE },
    longitude: { type: DataTypes.DOUBLE }
  })

  return Event
}


export default event
