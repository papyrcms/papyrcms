const event = (sequelize: any, DataTypes: any) => {
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
      defaultValue: "[]",
      type: DataTypes.TEXT,
      get() {
        // @ts-ignore
        const rawValue: string = this.getDataValue('tags')
        return JSON.parse(rawValue)
      },
      set(value: string[]) {
        // @ts-ignore
        this.setDataValue('tags', JSON.stringify(value))
      }
    },
    mainMedia: { type: DataTypes.TEXT },
    subImages: {
      defaultValue: "[]",
      type: DataTypes.TEXT,
      get() {
        // @ts-ignore
        const rawValue: string = this.getDataValue('subImages')
        return JSON.parse(rawValue)
      },
      set(value: string[]) {
        // @ts-ignore
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
