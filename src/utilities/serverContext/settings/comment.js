import _ from 'lodash'
import configureSettings from './configureSettings'


export default async () => {
  const defaultSettings = { enableCommenting: false }
  return await configureSettings("comment", defaultSettings)
}
