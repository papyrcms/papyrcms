import _ from 'lodash'
import { configureSettings } from "../../utilities/functions"


export default async () => {
  const defaultSettings = { enableCommenting: false }
  return await configureSettings("comment", defaultSettings)
}
