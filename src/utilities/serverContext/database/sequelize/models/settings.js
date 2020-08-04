import Sequelize from 'sequelize'


const settings = (sequelize, DataTypes) => {
  const Settings = sequelize.define('settings', {

    _id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },

    name: { type: DataTypes.STRING, allowNull: false },
    options: {
      type: DataTypes.TEXT,
      defaultValue: "[]",
      allowNull: false,
      get() {
        const rawValue = this.getDataValue('options')
        return rawValue ? JSON.parse(rawValue) : rawValue
      },
      set(value) {
        this.setDataValue('options', JSON.stringify(value))
      }
    }
  
  })

  return Settings
}


export default settings
