import _ from 'lodash'
import configureSettings from './configureSettings'


export default async () => {
  const defaultSettings = {
    enableEmailingToAdmin: true,
    enableEmailingToUsers: false
  }
  return await configureSettings("email", defaultSettings)
}
