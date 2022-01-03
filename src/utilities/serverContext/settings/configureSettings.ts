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

  let hasOptions = false
  if (settings) {
    const defaultOptionsKeys = Object.keys(settings.options)
    hasOptions = Object.keys(defaultOptions).every((optionKey) =>
      defaultOptionsKeys.includes(optionKey)
    )
  }

  // If we found one
  if (hasOptions) {
    appSettings = settings
  } else {
    const options = {
      ...defaultOptions,
      ...(settings?.options ?? {}),
    }

    // If we did not find one, create one
    appSettings = await save<Settings>(EntityType.Settings, {
      id: settings?.id,
      name,
      options,
    } as Settings)
  }

  return appSettings?.options
}

export default configureSettings
