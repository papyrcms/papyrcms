import configureSettings from './configureSettings'


export default async (database) => {
  const defaultSettings = {
    enableEmailingToAdmin: true,
    enableEmailingToUsers: false
  }
  return await configureSettings("email", defaultSettings, database)
}
