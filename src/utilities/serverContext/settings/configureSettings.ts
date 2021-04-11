import { Database, Settings } from '@/types'

const configureSettings = async (
  name: string,
  defaultOptions: Record<string, any>,
  database: Database
) => {
  const { EntityType, findOne, save } = database
  let appSettings

  // Search for the provided settings document
  const settings = await findOne<Settings>(EntityType.Settings, {
    name,
  })

  // If we found one
  if (settings) {
    appSettings = settings
  } else {
    // If we did not find one, create one
    appSettings = await save<Settings>(EntityType.Settings, {
      name,
      options: defaultOptions,
    } as Settings)
  }

  return appSettings?.options
}

export default configureSettings
