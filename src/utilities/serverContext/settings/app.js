import _ from 'lodash'
import configureSettings from './configureSettings'


export default async () => {
  const defaultSettings = { enableMenu: false }
  return await configureSettings("app", defaultSettings)
}
