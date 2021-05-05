const express = require('express')
const ejs = require('ejs')
const multer = require('multer')
const path = require('path')
const e = require('express')

// TODO Set Storage Engine
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req, file, cb){
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

// TODO Init Upload
const upload = multer({
    storage,
    limits: {
        fileSize: 500000
    },
    fileFilter: function(req, file, cb){
        checkFileType(file, cb)
    }
}).single('imageUpload')

// TODO Check File Type
function checkFileType(file, cb) {
    // TODO Allowed ext
    const filetypes = /jpeg|jpg|png|gif/
    // TODO Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLocaleLowerCase())
    // TODO Check Mime/Type
    const mimetype = filetypes.test(file.mimetype)

    if(mimetype && extname) {
        return cb(null, true)
    } else {
        cb('Error: Images Only!')
    }
}

// Init app
const app = express()

// EJS
app.set('view engine', 'ejs')

// Public Folder
app.use(express.static('./public'))

app.get('/', (req, res) => {
    res.render('index')
})

app.post('/upload', (req, res) => {
    upload(req, res, (err) => {
        if(err) {
            res.render('index', {
                msg: err
            })
        } else {
            if(req.file == undefined){
                res.render('index', {
                    msg: 'Error: No File Selected!'
                })
            } else {
                res.render('index', {
                    suc: 'File Uploaded!',
                    file: `uploads/${req.file.filename}`
                })
            }
        }
    })
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => console.log(`Server up and running on port ${PORT}`))