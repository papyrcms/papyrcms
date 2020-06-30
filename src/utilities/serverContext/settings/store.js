import configureSettings from './configureSettings'


export default async (database) => {
  const defaultSettings = { enableStore: false }
  return await configureSettings("store", defaultSettings, database)
}
