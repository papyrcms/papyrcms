import {
  BaseEntity,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Product } from './Product'
import { Order } from './Order'
import { DbAwarePGC } from '../utilities'

@Entity()
export class OrderedProduct extends BaseEntity {
  @DbAwarePGC()
  id!: string

  @PrimaryColumn()
  productId!: string

  @ManyToOne(() => Product, (product) => product.productOrders, {
    onDelete: 'CASCADE',
  })
  product!: Partial<Product>

  @PrimaryColumn()
  orderId!: string

  @ManyToOne(() => Order, (order) => order.orderedProducts, {
    onDelete: 'CASCADE',
  })
  order!: Partial<Order>

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date
}
