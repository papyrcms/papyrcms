import { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import util from 'util'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const files = await util.promisify(fs.readdir)(
    'src/components/Sections'
  )

  let sectionOptions = {}

  for (const file of files) {
    if (!file.includes('.tsx')) continue

    const {
      options,
    } = require(`../../../components/Sections/${file}`)
    sectionOptions = { ...sectionOptions, ...options }
  }

  return res.status(200).send(sectionOptions)
}
