const configureSettings = async (name, defaultOptions, database) => {

  const { Settings, findOne, create } = database
  let appSettings

  // Search for the provided settings document
  const settings = await findOne(Settings, { name })

  // If we found one
  if (settings) {
    appSettings = settings
  } else {

    // If we did not find one, create one
    appSettings = await create(Settings, { name, options: defaultOptions })
  }

  return appSettings.options
}


export default configureSettings
