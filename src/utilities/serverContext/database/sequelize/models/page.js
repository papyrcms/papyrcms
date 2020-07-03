import Sequelize from 'sequelize'


const page = (sequelize, DataTypes) => {
  const Page = sequelize.define('page', {

    _id: {
      type: DataTypes.UUID,
      default: DataTypes.UUIDV1,
      primaryKey: true
    },

    title: { type: DataTypes.STRING },
    className: { type: DataTypes.STRING },
    route: { type: DataTypes.STRING, allowNull: false, unique: true },
    navOrder: { type: DataTypes.INTEGER },
  
    // This will be JSON
    sections: {
      type: DataTypes.TEXT,
      get() {
        const rawValue = this.getDataValue(sections)
        return JSON.parse(rawValue)
      },
      set(value) {
        this.setDataValue('sections', JSON.stringify(value))
      }
    },
    css: { type: DataTypes.TEXT },
  
    created: { type: DataTypes.DATE, default: DataTypes.NOW },
  })

  return Page
}


export default page
