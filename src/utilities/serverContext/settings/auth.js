import configureSettings from './configureSettings'


export default async (database) => {
  const defaultSettings = { enableRegistration: true }
  return await configureSettings("auth", defaultSettings, database)
}
