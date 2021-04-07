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
}
