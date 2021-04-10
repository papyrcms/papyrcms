import { BaseEntity } from 'typeorm'
import * as types from '@/types'

export declare abstract class PapyrEntity extends BaseEntity {
  toModel(): Promise<types.DbModel> | types.DbModel
  static saveFromModel(model: types.DbModel): Promise<types.DbModel>
}
