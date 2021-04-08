import { Database } from '@/types'
import configureSettings from './configureSettings'

export default async (database: Database) => {
  const defaultSettings = { enableCommenting: false }
  return await configureSettings('comment', defaultSettings, database)
}
