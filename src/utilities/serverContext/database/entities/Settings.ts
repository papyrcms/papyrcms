import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Option } from './Option'
import * as types from '@/types'
import { PapyrEntity } from './PapyrEntity'

@Entity()
export class Settings extends PapyrEntity {
  @PrimaryGeneratedColumn('uuid')
  @Index()
  id!: string

  @Column()
  @Index({ unique: true })
  name!: string

  @ManyToOne(() => Option, (option) => option.settings, {
    onDelete: 'CASCADE',
  })
  options!: Partial<Option[]>

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date

  async toModel(): Promise<types.Settings> {
    const optionEntities = await Option.find({
      where: {
        settingsId: this.id,
      },
    })
    const options = optionEntities.reduce((options, option) => {
      options[option.key] = option.getParsedValue()
      return options
    }, {} as Record<string, any>)

    return {
      id: this.id,
      name: this.name,
      options,
      createdAt: new Date(this.createdAt),
      updatedAt: new Date(this.updatedAt),
    }
  }

  static async saveFromModel(
    settings: types.Settings
  ): Promise<types.Settings> {
    let foundSettings = await Settings.findOne({
      where: {
        id: settings.id,
      },
      relations: ['options'],
    })

    if (!foundSettings) {
      foundSettings = Settings.create()
      foundSettings.options = []
    }

    foundSettings.name = settings.name
    foundSettings = await foundSettings.save()

    for (const key of Object.keys(settings.options)) {
      let foundOption = foundSettings.options.find(
        (option) => option?.key === key
      )
      if (!foundOption) {
        foundOption = Option.create()
      }
      foundOption.key = key
      foundOption.value = settings.options[key].toString()
      foundOption.type = Option.getValueType(settings.options[key])
      foundOption.settingsId = foundSettings.id
      await foundOption.save()
    }

    return await foundSettings.toModel()
  }
}
