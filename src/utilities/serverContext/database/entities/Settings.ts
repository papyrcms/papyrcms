import {
  Column,
  CreateDateColumn,
  Entity,
  getRepository,
  Index,
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
    const optionRepo = getRepository<Option>('Option')
    const optionEntities = await optionRepo.find({
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
    const settingsRepo = getRepository<Settings>('Settings')
    const optionsRepo = getRepository<Option>('Option')

    let foundSettings = await settingsRepo.findOne({
      where: {
        id: settings.id,
      },
      // relations: ['options'],
    })

    if (!foundSettings) {
      foundSettings = settingsRepo.create()
      foundSettings.options = []
    } else {
      foundSettings.options = await optionsRepo.find({
        where: {
          settingsId: settings.id,
        },
      })
    }

    foundSettings.name = settings.name
    foundSettings = await foundSettings.save()

    for (const key of Object.keys(settings.options)) {
      let foundOption = foundSettings.options.find(
        (option) => option?.key === key
      )
      if (!foundOption) {
        foundOption = optionsRepo.create()
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
