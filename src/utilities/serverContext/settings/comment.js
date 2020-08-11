import configureSettings from './configureSettings'


export default async (database) => {
  const defaultSettings = { enableCommenting: false }
  return await configureSettings("comment", defaultSettings, database)
}
