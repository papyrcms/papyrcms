import configureSettings from './configureSettings'


export default async (database) => {
  const defaultSettings = { enableEvents: false }
  return await configureSettings("event", defaultSettings, database)
}
