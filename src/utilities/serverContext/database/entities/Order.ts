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
}
