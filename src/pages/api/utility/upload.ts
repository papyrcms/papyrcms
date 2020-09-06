import { NextApiRequest, NextApiResponse } from 'next'
import formidable from 'formidable'
import cloudinary from 'cloudinary'
import serverContext from '@/serverContext'
import keys from '@/keys'


const { cloudinaryCloudName, cloudinaryApiKey, cloudinaryApiSecret } = keys
cloudinary.v2.config({
  cloud_name: cloudinaryCloudName,
  api_key: cloudinaryApiKey,
  api_secret: cloudinaryApiSecret
})


export const config = {
  api: {
    bodyParser: false,
  },
}


export default async (req: NextApiRequest, res: NextApiResponse) => {

  const { user, done } = await serverContext(req, res)
  if (!user || !user.isAdmin) {
    return await done(401, { message: 'You are not allowed to do that.' })
  }

  if (req.method === 'POST') {
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {

      if (err) {
        return await done(500, err)
      }

      const uploadResponse = await cloudinary.v2.uploader.upload(files.file.path, { resource_type: 'auto', angle: 0 })
      return await done(200, uploadResponse.secure_url)
    })

    return
  }

  return await done(404, { message: 'Page not found.' })
}
