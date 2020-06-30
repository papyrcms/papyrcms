import configureSettings from './configureSettings'


export default async (database) => {
  const defaultSettings = { enableBlog: false }
  return await configureSettings('blog', defaultSettings, database)
}
