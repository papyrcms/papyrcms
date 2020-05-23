import configureSettings from './configureSettings'


export default async () => {
  const defaultSettings = { enableEvents: false }
  return await configureSettings("event", defaultSettings)
}
