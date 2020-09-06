const page = (sequelize: any, DataTypes: any) => {
  const Page = sequelize.define('page', {
    _id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },

    title: { type: DataTypes.STRING },
    className: { type: DataTypes.STRING },
    route: { type: DataTypes.STRING, allowNull: false, unique: true },
    navOrder: { type: DataTypes.INTEGER },

    // This will be JSON
    sections: {
      type: DataTypes.TEXT,
      defaultValue: '[]',
      get() {
        // @ts-ignore
        const rawValue: string = this.getDataValue('sections')
        return JSON.parse(rawValue)
      },
      set(value: string[]) {
        // @ts-ignore
        this.setDataValue('sections', JSON.stringify(value))
      },
    },
    css: { type: DataTypes.TEXT },

    created: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  })

  return Page
}

export default page
