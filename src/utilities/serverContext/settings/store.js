import _ from 'lodash'
import configureSettings from './configureSettings'


export default async () => {
  const defaultSettings = { enableStore: false }
  return await configureSettings("store", defaultSettings)
}
