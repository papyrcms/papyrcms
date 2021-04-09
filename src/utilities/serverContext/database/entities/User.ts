import {
  BaseEntity,
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

@Entity()
export class User extends BaseEntity {
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
}
