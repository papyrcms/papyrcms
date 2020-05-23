import _ from 'lodash'
import configureSettings from './configureSettings'


export default async () => {
  const defaultSettings = { enableBlog: false }
  return await configureSettings('blog', defaultSettings)
}
