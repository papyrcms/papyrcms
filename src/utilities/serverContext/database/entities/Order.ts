import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { User } from './User'
import { OrderedProduct } from './OrderedProduct'
import * as types from '@/types'
import products from 'src/pages/api/store/products'
import { Product } from '.'

@Entity()
export class Order extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @Index()
  id!: string

  @Column('text')
  notes?: string

  @Column({ default: false })
  isShipped!: boolean

  @Column()
  userId?: string

  @ManyToOne(() => User, (user) => user.orders, {
    onDelete: 'CASCADE',
  })
  user?: User

  @OneToMany(
    () => OrderedProduct,
    (orderedProduct) => orderedProduct.product
  )
  orderedProducts!: OrderedProduct[]

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date

  async toModel(): Promise<types.Order> {
    const orderedProducts = await OrderedProduct.find({
      where: {
        orderId: this.id,
      },
      relations: ['product'],
    })
    const products = orderedProducts.map((orderedProduct) => {
      return orderedProduct.product.toModel()
    })

    const userEntity = await User.findOne({
      where: {
        id: this.userId,
      },
    })
    const user = await userEntity?.toModel()

    return {
      id: this.id,
      notes: this.notes || '',
      products,
      user,
      isShipped: this.isShipped,
      updatedAt: new Date(this.updatedAt),
      createdAt: new Date(this.createdAt),
    }
  }
}
