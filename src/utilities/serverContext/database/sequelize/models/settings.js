import Sequelize from 'sequelize'


const settings = (sequelize, DataTypes) => {
  const Settings = sequelize.define('settings', {

    _id: {
      type: DataTypes.UUID,
      default: DataTypes.UUIDV1,
      primaryKey: true
    },

    name: { type: DataTypes.STRING, allowNull: false },
    options: {
      type: DataTypes.TEXT,
      allowNull: false,
      get() {
        const rawValue = this.getDataValue(options)
        return JSON.parse(rawValue)
      },
      set(value) {
        this.setDataValue('options', JSON.stringify(value))
      }
    }
  
  })

  return Settings
}


export default settings
