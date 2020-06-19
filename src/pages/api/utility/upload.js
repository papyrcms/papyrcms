import multer from 'multer'
import cloudinary from 'cloudinary'
import serverContext from '@/serverContext'
import keys from '@/keys'


const storage = multer.diskStorage({
  filename: (req, file, callback) => {
    callback(null, Date.now() + file.originalname)
  }
})
const fileFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
    return cb(new Error('Only image files are allowed!'), false)
  }
  cb(null, true)
}
const upload = multer({ storage, fileFilter })

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


export default async (req, res) => {

  const { user, done } = await serverContext(req, res)
  if (!user || !user.isAdmin) {
    return await done(401, { message: 'You are not allowed to do that.' })
  }

  if (req.method === 'POST') {
    const err = await upload.single('file')(req, res)
    if (err) {
      return await done(401, { message: err.message })
    }

    const uploadResponse = await cloudinary.v2.uploader.upload(req.file.path, { resource_type: 'auto', angle: 0 })
    return await done(200, uploadResponse.secure_url)
  }

  return await done(404, { message: 'Page not found.' })
}
