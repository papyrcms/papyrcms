import _ from 'lodash'
import { configureSettings } from "../../utilities/functions"


export default async () => {
  const defaultSettings = { enableStore: false }
  return await configureSettings("store", defaultSettings)
}
