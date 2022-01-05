import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  UpdateDateColumn,
} from 'typeorm'
import { DbAwarePGC } from '../utilities'
import { Settings } from './Settings'

@Entity()
export class Option extends BaseEntity {
  @DbAwarePGC()
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

  @OneToMany(() => Settings, (settings) => settings.options)
  settings!: Partial<Settings>

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date

  getParsedValue(): string | number | boolean {
    switch (this.type) {
      case 'string':
        return this.value
      case 'int':
        return parseInt(this.value)
      case 'float':
        return parseFloat(this.value)
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
