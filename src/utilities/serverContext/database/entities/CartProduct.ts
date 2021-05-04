import {
  BaseEntity,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm'
import { DbAwarePGC } from '../utilities'
import { Product } from './Product'
import { User } from './User'

@Entity()
export class CartProduct extends BaseEntity {
  @DbAwarePGC()
  id!: string

  @PrimaryColumn()
  productId!: string

  @ManyToOne(() => Product, (product) => product.carts, {
    onDelete: 'CASCADE',
  })
  product!: Partial<Product>

  @PrimaryColumn()
  userId!: string

  @ManyToOne(() => User, (user) => user.cart, {
    onDelete: 'CASCADE',
  })
  user!: Partial<User>

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date
}
