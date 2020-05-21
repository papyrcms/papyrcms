import _ from 'lodash'
import { configureSettings } from "../../utilities/functions"


export default async () => {
  const defaultSettings = { enableEvents: false }
  return await configureSettings("event", defaultSettings)
}
