import _ from 'lodash'
import { configureSettings } from '../../utilities/functions'


export default async () => {
  const defaultSettings = { enableMenu: false }
  return await configureSettings("app", defaultSettings)
}
