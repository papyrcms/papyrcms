import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Settings } from './Settings'

@Entity()
export class Option extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @Index()
  id!: string

  @Column()
  @Index({ unique: true })
  key!: string

  @Column()
  value!: string

  @Column()
  type!: 'string' | 'int' | 'float' | 'boolean'

  @Column()
  settingsId!: string

  @JoinColumn()
  @OneToMany(() => Settings, (settings) => settings.options)
  settings!: Partial<Settings>

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date

  getParsedValue(): any {
    switch (this.type) {
      case 'string':
        return this.value
      case 'int':
        return parseInt(this.value)
      case 'float':
        return parseFloat(this.key)
      case 'boolean':
        return this.value.toLowerCase() === 'true'
    }
  }

  static getValueType(
    value: any
  ): 'string' | 'int' | 'float' | 'boolean' {
    switch (typeof value) {
      case 'string':
        return 'string'
      case 'boolean':
        return 'boolean'
      case 'number':
        return value % 1 === 0 ? 'int' : 'float'
      default:
        return 'string'
    }
  }
}
