import _ from 'lodash'
import { configureSettings } from '../../utilities/functions'


export default async () => {
  const defaultSettings = { enableBlog: false }
  return await configureSettings('blog', defaultSettings)
}
