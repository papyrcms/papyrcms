import { Database } from 'types'
import configureSettings from './configureSettings'

export default async (database: Database) => {
  const defaultSettings = {
    enableEvents: false,
    eventsMenuLocation: 0,
  }
  return await configureSettings('event', defaultSettings, database)
}
