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
import { User } from './User'

@Entity()
export class CartProduct extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @Index()
  id!: string

  @PrimaryColumn()
  @Index()
  productId!: string

  @ManyToOne(() => Product, (product) => product.carts, {
    onDelete: 'CASCADE',
  })
  product!: Product

  @PrimaryColumn()
  @Index()
  userId!: string

  @ManyToOne(() => User, (user) => user.cart, {
    onDelete: 'CASCADE',
  })
  user!: User

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date
}
