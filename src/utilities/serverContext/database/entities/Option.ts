import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
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

  @OneToMany(() => Settings, (settings) => settings.options)
  settings!: Settings

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
}
