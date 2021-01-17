import { Database } from 'types'
import configureSettings from './configureSettings'

export default async (database: Database) => {
  const defaultSettings = {
    enableStore: false,
    storeMenuLocation: 0,
  }
  return await configureSettings('store', defaultSettings, database)
}
