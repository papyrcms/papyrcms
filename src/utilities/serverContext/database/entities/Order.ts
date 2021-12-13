import {
  Column,
  CreateDateColumn,
  Entity,
  getRepository,
  ManyToOne,
  OneToMany,
  UpdateDateColumn,
} from 'typeorm'
import { User } from './User'
import { OrderedProduct } from './OrderedProduct'
import * as types from '../../../../types'
import { PapyrEntity } from './PapyrEntity'
import { Product } from './Product'
import {
  DbAwareColumn,
  DbAwarePGC,
  sanitizeConditions,
} from '../utilities'

@Entity()
export class Order extends PapyrEntity {
  @DbAwarePGC()
  id!: string

  @DbAwareColumn({ type: 'text' })
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
    const orderedProdRepo =
      getRepository<OrderedProduct>('OrderedProduct')
    const userRepo = getRepository<User>('User')
    const orderedProducts = await orderedProdRepo.find({
      where: sanitizeConditions({
        orderId: this.id.toString(),
      }),
      relations: ['product'],
    })

    // Fake join if necessary (mongo)
    if (orderedProducts.some((cp) => !cp.product)) {
      const productRepo = getRepository<Product>('Product')
      for (const orderedProduct of orderedProducts) {
        if (orderedProduct.product) continue

        orderedProduct.product = (await productRepo.findOne({
          where: sanitizeConditions({
            id: orderedProduct.productId,
          }),
        })) as Product
      }
    }

    const products = orderedProducts.map((orderedProduct) => {
      return (orderedProduct.product as Product).toModel()
    })

    const userEntity = await userRepo.findOne({
      where: sanitizeConditions({
        id: this.userId,
      }),
    })
    const user = await userEntity?.toModel()

    return {
      id: this.id.toString(),
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
    const orderedProdRepo =
      getRepository<OrderedProduct>('OrderedProduct')
    let foundOrder
    if (order.id) {
      foundOrder = await orderRepo.findOne({
        where: sanitizeConditions({
          id: order.id,
        }),
      })
    }

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
            orderId: foundOrder.id.toString(),
            productId: product.id.toString(),
          })
          .save()
      }
    }

    return await foundOrder.toModel()
  }
}
