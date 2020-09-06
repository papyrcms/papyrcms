const settings = (sequelize: any, DataTypes: any) => {
  const Settings = sequelize.define('settings', {
    _id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },

    name: { type: DataTypes.STRING, allowNull: false },
    options: {
      type: DataTypes.TEXT,
      defaultValue: '[]',
      allowNull: false,
      get() {
        // @ts-ignore
        const rawValue: string = this.getDataValue('options')
        return rawValue ? JSON.parse(rawValue) : rawValue
      },
      set(value: { [key: string]: any }) {
        // @ts-ignore
        this.setDataValue('options', JSON.stringify(value))
      },
    },
  })

  return Settings
}

export default settings
