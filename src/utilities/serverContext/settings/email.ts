import { Database } from 'types'
import configureSettings from './configureSettings'

export default async (database: Database) => {
  const defaultSettings = {
    enableEmailingToAdmin: true,
    enableEmailingToUsers: false,
  }
  return await configureSettings('email', defaultSettings, database)
}
