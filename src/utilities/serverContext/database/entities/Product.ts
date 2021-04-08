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
import { CartProduct } from './CartProduct'
import { OrderedProduct } from './OrderedProduct'

@Entity()
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @Index()
  id!: string

  @Column({ default: '' })
  title!: string

  @Column({ default: '' })
  @Index()
  slug!: string

  @Column('text', { default: '' })
  content!: string

  @Column({ default: '' })
  tags!: string

  @Column({ default: '' })
  media!: string

  @Column({ default: false })
  published!: boolean

  @Column('double', { default: 0.0 })
  price!: number

  @Column('int', { default: 0 })
  quantity!: number

  @OneToMany(() => CartProduct, (cartProduct) => cartProduct.product)
  carts!: CartProduct[]

  @OneToMany(
    () => OrderedProduct,
    (orderedProduct) => orderedProduct.product
  )
  productOrders!: OrderedProduct[]

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date
}