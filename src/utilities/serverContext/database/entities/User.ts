import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Order } from './Order'
import { CartProduct } from './CartProduct'
import { Comment } from './Comment'
import * as types from '@/types'
import { PapyrEntity } from './PapyrEntity'

@Entity()
export class User extends PapyrEntity {
  @PrimaryGeneratedColumn('uuid')
  @Index()
  id!: string

  @Index()
  @Column({ unique: true })
  email!: string

  @Column()
  password!: string

  @Column()
  firstName!: string

  @Column()
  lastName!: string

  @Column({ nullable: true })
  address1?: string

  @Column({ nullable: true })
  address2?: string

  @Column({ nullable: true })
  city?: string

  @Column({ nullable: true })
  state?: string

  @Column({ nullable: true })
  zip?: string

  @Column({ nullable: true })
  country?: string

  @Column({ nullable: true })
  shippingFirstName?: string

  @Column({ nullable: true })
  shippingLastName?: string

  @Column({ nullable: true })
  shippingEmail?: string

  @Column({ nullable: true })
  shippingAddress1?: string

  @Column({ nullable: true })
  shippingAddress2?: string

  @Column({ nullable: true })
  shippingCity?: string

  @Column({ nullable: true })
  shippingState?: string

  @Column({ nullable: true })
  shippingZip?: string

  @Column({ nullable: true })
  shippingCountry?: string

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date

  @Column({ default: false })
  isAdmin!: boolean

  @Column({ default: true })
  isSubscribed!: boolean

  @Column({ default: false })
  isBanned!: boolean

  @OneToMany(() => CartProduct, (cartProduct) => cartProduct.user)
  cart!: CartProduct[]

  @OneToMany(() => Comment, (comment) => comment.author)
  comments!: Comment[]

  @OneToMany(() => Order, (order) => order.user)
  orders!: Order[]

  async toModel(): Promise<types.User> {
    const connectedProducts = await CartProduct.find({
      where: {
        userId: this.id,
      },
      relations: ['product'],
    })
    const cart = connectedProducts.map((connectedProduct) =>
      connectedProduct.product.toModel()
    )

    return {
      id: this.id,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      isAdmin: this.isAdmin,
      isSubscribed: this.isSubscribed,
      isBanned: this.isBanned,
      address1: this.address1,
      address2: this.address2,
      city: this.city,
      state: this.state,
      country: this.country,
      zip: this.zip,
      shippingFirstName: this.shippingFirstName,
      shippingLastName: this.shippingLastName,
      shippingEmail: this.shippingEmail,
      shippingAddress1: this.shippingAddress1,
      shippingAddress2: this.shippingAddress2,
      shippingCity: this.shippingCity,
      shippingState: this.shippingState,
      shippingCountry: this.shippingCountry,
      shippingZip: this.shippingZip,
      cart,
      updatedAt: new Date(this.updatedAt),
      createdAt: new Date(this.createdAt),
    }
  }

  static async saveFromModel(user: types.User): Promise<types.User> {
    let foundUser = await User.findOne({
      where: {
        id: user.id,
      },
    })

    if (!foundUser) {
      foundUser = User.create()
    }

    foundUser.email = user.email
    foundUser.firstName = user.firstName
    foundUser.lastName = user.lastName
    foundUser.isAdmin = user.isAdmin
    foundUser.isSubscribed = user.isSubscribed
    foundUser.isBanned = user.isBanned
    foundUser.address1 = user.address1
    foundUser.address2 = user.address2
    foundUser.city = user.city
    foundUser.state = user.state
    foundUser.country = user.country
    foundUser.zip = user.zip
    foundUser.shippingFirstName = user.shippingFirstName
    foundUser.shippingLastName = user.shippingLastName
    foundUser.shippingEmail = user.shippingEmail
    foundUser.shippingAddress1 = user.shippingAddress1
    foundUser.shippingAddress2 = user.shippingAddress2
    foundUser.shippingCity = user.shippingCity
    foundUser.shippingState = user.shippingState
    foundUser.shippingCountry = user.shippingCountry
    foundUser.shippingZip = user.shippingZip
    foundUser = await foundUser.save()

    // Add to cart/Remove from cart
    // Note: This assumes products will only ever be added OR removed
    // from the cart in one transaction. Should that change, this needs redone
    const cartProducts = await CartProduct.find({
      where: {
        userId: user.id,
      },
    })
    if (cartProducts.length > user.cart.length) {
      // Remove from cart
      for (const cartProduct of cartProducts) {
        const removedFromCart = !user.cart.some(
          (product) => product.id === cartProduct.productId
        )
        if (removedFromCart) {
          await cartProduct.remove()
        }
      }
    } else {
      // Add to cart
      for (const product of user.cart) {
        const addedToCart = !cartProducts.some(
          (cartProduct) => cartProduct.productId === product.id
        )
        if (addedToCart) {
          await CartProduct.create({
            userId: user.id,
            productId: product.id,
          }).save()
        }
      }
    }

    return await foundUser.toModel()
  }
}
