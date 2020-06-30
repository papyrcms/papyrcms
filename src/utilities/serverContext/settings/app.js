import configureSettings from './configureSettings'


export default async (database) => {
  const defaultSettings = { enableMenu: false }
  return await configureSettings("app", defaultSettings, database)
}
