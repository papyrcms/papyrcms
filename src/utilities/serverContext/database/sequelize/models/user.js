import Sequelize from 'sequelize'


const user = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {

    _id: {
      type: DataTypes.UUID,
      default: DataTypes.UUIDV1,
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

    // Shop info
    // cart: [{
    //   type: DataTypes.UUIDV1,
    //   references: {
    //     model: Product,
    //     key: _id
    //   }
    // }],

    // Account creation date
    created: { type: DataTypes.DATE, default: DataTypes.NOW },

    // Etc
    isAdmin: { type: DataTypes.BOOLEAN, default: false },
    isSubscribed: { type: DataTypes.BOOLEAN, default: true },
    isBanned: { type: DataTypes.BOOLEAN, default: false }
  })

  return User
}

export default user
