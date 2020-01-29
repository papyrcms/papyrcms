import connect from 'next-connect'
import multer from 'multer'
import cloudinary from 'cloudinary'
import common from '../../../middleware/common/'
import keys from '../../../config/keys'


const handler = connect()
handler.use(common)


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
cloudinary.config({
  cloud_name: cloudinaryCloudName,
  api_key: cloudinaryApiKey,
  api_secret: cloudinaryApiSecret
})


export const config = {
  api: {
    bodyParser: false,
  },
}


handler.post(async (req, res) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(401).send({ message: 'You are not allowed to do that.' })
  }

  upload.single('file')(req, {}, async err => {
    if (err) {
      return res.status(401).send({ message: err.message })
    }

    const uploadResponse = await cloudinary.v2.uploader.upload(req.file.path, { resource_type: 'auto', angle: 0 })
    return res.send(uploadResponse.secure_url)
  })
})


export default handler
