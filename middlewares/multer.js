const multer = require('multer')
const slugify = require('slugify')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public')
    },
    filename: function (req, file, cb) {
        const slugifiedName = slugify(file.originalname, {
            lower: true,
            trim: true
        })

        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}-${slugifiedName}`
        cb(null, uniqueName)
    }
})

const upload = multer({ storage })

module.exports = upload;