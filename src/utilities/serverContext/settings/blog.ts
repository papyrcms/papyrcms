import { Database } from 'types'
import configureSettings from './configureSettings'

export default async (database: Database) => {
  const defaultSettings = {
    enableBlog: false,
    blogMenuLocation: 0,
  }
  return await configureSettings('blog', defaultSettings, database)
}
