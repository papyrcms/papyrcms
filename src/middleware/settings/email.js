import _ from 'lodash'
import { configureSettings } from "../../utilities/functions"


export default async () => {
  const defaultSettings = {
    enableEmailingToAdmin: true,
    enableEmailingToUsers: false
  }
  return await configureSettings("email", defaultSettings)
}
