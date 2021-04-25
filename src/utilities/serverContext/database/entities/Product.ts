import {
  Column,
  CreateDateColumn,
  Entity,
  getRepository,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { CartProduct } from './CartProduct'
import { OrderedProduct } from './OrderedProduct'
import * as types from '@/types'
import { PapyrEntity } from './PapyrEntity'

@Entity()
export class Product extends PapyrEntity {
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
  isPublished!: boolean

  @Column('float', { default: 0.0 })
  price!: number

  @Column('int', { default: 0 })
  quantity!: number

  @OneToMany(() => CartProduct, (cartProduct) => cartProduct.product)
  carts!: Partial<CartProduct[]>

  @OneToMany(
    () => OrderedProduct,
    (orderedProduct) => orderedProduct.product
  )
  productOrders!: Partial<OrderedProduct[]>

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date

  toModel(): types.Product {
    return {
      id: this.id,
      title: this.title,
      tags: this.tags.split(',').map((tag) => tag.trim()),
      slug: this.slug,
      media: this.media,
      content: this.content,
      isPublished: this.isPublished,
      price: this.price,
      quantity: this.quantity,
      updatedAt: new Date(this.updatedAt),
      createdAt: new Date(this.createdAt),
    }
  }

  static async saveFromModel(
    product: types.Product
  ): Promise<types.Product> {
    const productRepo = getRepository<Product>('Product')
    let foundProduct = await productRepo.findOne({
      where: {
        id: product.id,
      },
    })

    if (!foundProduct) {
      foundProduct = productRepo.create()
    }

    foundProduct.title = product.title
    foundProduct.content = product.content
    foundProduct.slug = product.slug
    foundProduct.tags = product.tags.join(', ')
    foundProduct.media = product.media
    foundProduct.isPublished = product.isPublished
    foundProduct.price = product.price
    foundProduct.quantity = product.quantity

    foundProduct = await foundProduct.save()

    return await foundProduct.toModel()
  }
}
