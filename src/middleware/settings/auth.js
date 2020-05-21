import _ from 'lodash'
import { configureSettings } from "../../utilities/functions"


export default async () => {
  const defaultSettings = { enableRegistration: true }
  return await configureSettings("auth", defaultSettings)
}
