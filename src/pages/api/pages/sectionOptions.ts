import { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import util from 'util'
import _ from 'lodash'
import path from 'path'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // const sectionPath = path.join(__dirname, )
  const files = await util.promisify(fs.readdir)('src/sections')

  let sectionOptions = {}

  // Old way
  for (const file of files) {
    if (file.includes('index.ts')) continue

    const section = require(`../../../sections/${file}`)

    sectionOptions = { ...sectionOptions, ...section.options }
  }

  // New way
  const components = await util.promisify(fs.readdir)(
    'src/components'
  )
  _.forEach(components, (component) => {
    if (fs.existsSync(`src/components/${component}/options.ts`)) {
      const {
        options,
      } = require(`../../../components/${component}/options`)
      sectionOptions = { ...sectionOptions, ...options }
    }
  })

  return res.status(200).send(sectionOptions)
}
