import {
  Column,
  CreateDateColumn,
  Entity,
  getRepository,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { User } from './User'
import { OrderedProduct } from './OrderedProduct'
import * as types from '@/types'
import { PapyrEntity } from './PapyrEntity'
import { Product } from './Product'

@Entity()
export class Order extends PapyrEntity {
  @PrimaryGeneratedColumn('uuid')
  @Index()
  id!: string

  @Column('text')
  notes?: string

  @Column({ default: false })
  isShipped!: boolean

  @Column({ nullable: true })
  userId?: string

  @ManyToOne(() => User, (user) => user.orders, {
    onDelete: 'CASCADE',
  })
  user?: Partial<User>

  @OneToMany(
    () => OrderedProduct,
    (orderedProduct) => orderedProduct.product
  )
  orderedProducts!: Partial<OrderedProduct[]>

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date

  async toModel(): Promise<types.Order> {
    const orderedProdRepo = getRepository<OrderedProduct>(
      'OrderedProduct'
    )
    const userRepo = getRepository<User>('User')
    const orderedProducts = await orderedProdRepo.find({
      where: {
        orderId: this.id,
      },
      relations: ['product'],
    })
    const products = orderedProducts.map((orderedProduct) => {
      return (orderedProduct.product as Product).toModel()
    })

    const userEntity = await userRepo.findOne({
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

  static async saveFromModel(
    order: types.Order
  ): Promise<types.Order> {
    const orderRepo = getRepository<Order>('Order')
    const orderedProdRepo = getRepository<OrderedProduct>(
      'OrderedProduct'
    )
    let foundOrder = await orderRepo.findOne({
      where: {
        id: order.id,
      },
    })

    if (!foundOrder) {
      foundOrder = orderRepo.create()
    }

    foundOrder.notes = order.notes
    foundOrder.isShipped = order.isShipped
    foundOrder.userId = order.user?.id

    foundOrder = await foundOrder.save()

    if (!order.id) {
      for (const product of order.products) {
        await orderedProdRepo
          .create({
            orderId: foundOrder?.id,
            productId: product.id,
          })
          .save()
      }
    }

    return await foundOrder.toModel()
  }
}
