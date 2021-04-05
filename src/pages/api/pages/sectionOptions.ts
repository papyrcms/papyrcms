import { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import util from 'util'
import _ from 'lodash'
import path from 'path'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  let sectionOptions = {}

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
