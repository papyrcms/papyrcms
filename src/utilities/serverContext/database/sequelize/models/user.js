const user = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {

    _id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },

    // Authentication info
    email: { type: DataTypes.STRING, unique: true },
    password: { type: DataTypes.STRING },

    // Personal Info
    firstName: { type: DataTypes.STRING },
    lastName: { type: DataTypes.STRING },

    // Billing info
    address1: { type: DataTypes.STRING },
    address2: { type: DataTypes.STRING },
    city: { type: DataTypes.STRING },
    state: { type: DataTypes.STRING },
    zip: { type: DataTypes.STRING },
    country: { type: DataTypes.STRING },

    // Shipping info
    shippingFirstName: { type: DataTypes.STRING },
    shippingLastName: { type: DataTypes.STRING },
    shippingEmail: { type: DataTypes.STRING },
    shippingAddress1: { type: DataTypes.STRING },
    shippingAddress2: { type: DataTypes.STRING },
    shippingCity: { type: DataTypes.STRING },
    shippingState: { type: DataTypes.STRING },
    shippingZip: { type: DataTypes.STRING },
    shippingCountry: { type: DataTypes.STRING },

    // This seems non-ideal, but sequelize will not allow duplicate
    // many-to-many records in the cart table
    cart: {
      type: DataTypes.TEXT,
      defaultValue: '[]',
      get() {
        const rawValue = this.getDataValue('cart')
        return JSON.parse(rawValue)
      },
      set(value) {
        this.setDataValue('cart', JSON.stringify(value))
      }
    },

    // Account creation date
    created: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },

    // Etc
    isAdmin: { type: DataTypes.BOOLEAN, defaultValue: false },
    isSubscribed: { type: DataTypes.BOOLEAN, defaultValue: true },
    isBanned: { type: DataTypes.BOOLEAN, defaultValue: false }
  })

  User.buildAssociations = models => {
    User.belongsTo(models.Order)
  }

  return User
}

export default user
