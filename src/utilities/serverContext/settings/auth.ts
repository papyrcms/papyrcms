import { Database } from 'types'
import configureSettings from './configureSettings'

export default async (database: Database) => {
  const defaultSettings = { enableRegistration: true }
  return await configureSettings('auth', defaultSettings, database)
}
