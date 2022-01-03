import { Database } from '@/types'
import configureSettings from './configureSettings'

export default async (database: Database) => {
  const defaultSettings = {
    enableMenu: false,
    enableNav: true,
    stickyNav: false,
  }
  return await configureSettings('app', defaultSettings, database)
}
