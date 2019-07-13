const Settings = require('../models/settings')

const configureSettings = async (name, defaultOptions) => {

  // Search for the provided settings document
  const settings = await Settings.findOne({ name })

  // If we found one, return it
  if (settings) {
    appSettings = settings
  } else {
    // If we did not find one, create one
    appSettings = new Settings({ name, options: defaultOptions })
    appSettings.save()
    console.log(`New ${name} settings document created`)

    // Might not need this. I have fixed bugs since then. If I come
    // back to this and notice I have not had any problems,
    // remove the following commented section section

    // // Give mongo time to save the document 
    // // before running the funciton again
    // // to prevent creating a duplicate settings document
    // setTimeout(() => { }, 3000)
  }

  return appSettings.options
}

module.exports = { configureSettings }