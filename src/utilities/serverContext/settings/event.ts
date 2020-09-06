import { Database } from 'types'
import configureSettings from './configureSettings'

export default async (database: Database) => {
  const defaultSettings = { enableEvents: false }
  return await configureSettings('event', defaultSettings, database)
}
