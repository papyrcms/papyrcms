import fs from 'fs'


export default (req, res) => {

  const files = fs.readdirSync("src/components/Sections")

  let sectionOptions = {}

  for (const file of files) {
    const { options } = require(`../../../components/Sections/${file}`)
    sectionOptions = { ...sectionOptions, ...options }
  }

  return res.status(200).send(sectionOptions)
}
