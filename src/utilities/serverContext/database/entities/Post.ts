import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity()
export class Post extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @Index()
  id!: string

  @Column({ default: '' })
  title!: string

  @Column({ default: '' })
  @Index()
  slug!: string

  @Column({ default: '' })
  content!: string

  @Column({ default: '' })
  tags!: string

  @Column({ default: '' })
  media!: string

  @Column({ default: false })
  published!: boolean

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date
}
