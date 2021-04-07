import {
  BaseEntity,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Product } from './Product'
import { Order } from './Order'

@Entity()
export class OrderedProduct extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @Index()
  id!: string

  @PrimaryColumn()
  @Index()
  productId!: string

  @ManyToOne(() => Product, (product) => product.productOrders, {
    onDelete: 'CASCADE',
  })
  product!: Product

  @PrimaryColumn()
  @Index()
  orderId!: string

  @ManyToOne(() => Order, (order) => order.orderedProducts, {
    onDelete: 'CASCADE',
  })
  order!: Order

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date
}
