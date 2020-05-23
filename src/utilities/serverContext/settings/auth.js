import _ from 'lodash'
import configureSettings from './configureSettings'


export default async () => {
  const defaultSettings = { enableRegistration: true }
  return await configureSettings("auth", defaultSettings)
}
