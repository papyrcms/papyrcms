import multer from 'multer'
import cloudinary from 'cloudinary'
import common from '../../../middleware/common'
import keys from '../../../config/keys'


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

  const { user } = await common(req, res)
  if (!user || !user.isAdmin) {
    return res.status(401).send({ message: 'You are not allowed to do that.' })
  }

  if (req.method === 'POST') {
    const err = await upload.single('file')(req, res)
    if (err) {
      return res.status(401).send({ message: err.message })
    }

    const uploadResponse = await cloudinary.v2.uploader.upload(req.file.path, { resource_type: 'auto', angle: 0 })
    return res.status(200).send(uploadResponse.secure_url)
  }

  return res.status(404).send({ message: 'Page not found.' })
}
