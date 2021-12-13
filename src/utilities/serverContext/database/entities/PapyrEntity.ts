import { BaseEntity } from 'typeorm'
import * as types from '../../../../types'

export abstract class PapyrEntity extends BaseEntity {
  toModel(): Promise<types.DbModel> | types.DbModel {
    return {} as types.DbModel
  }
  static async saveFromModel(
    model: types.DbModel
  ): Promise<types.DbModel> {
    return (await {}) as types.DbModel
  }
}
