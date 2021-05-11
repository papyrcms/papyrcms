import { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import util from 'util'
import path from 'path'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  let sectionOptions = {}

  const components = await util.promisify(fs.readdir)(
    path.join('src', 'components')
  )
  components.forEach((component) => {
    const hasOptions = fs.existsSync(
      path.join('src', 'components', component, 'options.ts')
    )
    if (hasOptions) {
      const {
        options,
      } = require(`../../../components/${component}/options`)
      sectionOptions = { ...sectionOptions, ...options }
    }
  })

  return res.status(200).send(sectionOptions)
}
