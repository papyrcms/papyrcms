import { Database } from '@/types'
import configureSettings from './configureSettings'

export default async (database: Database) => {
  const defaultSettings = { enableMenu: false }
  return await configureSettings('app', defaultSettings, database)
}
