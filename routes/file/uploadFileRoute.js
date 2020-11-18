const express = require('express')
const app = express.Router()
const multer = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

const upload = multer({ storage: storage })

const fs = require('fs')
const path = require('path')
fs.readdir(path.resolve(), (err, files) => {
    if (err)
        console.log(err);
    else
        if (!files.includes('uploads')) {
            fs.mkdir(path.resolve('uploads'), (err) => 1)
        }
})

app.post('/file', upload.single('file'), (req, res) => {
    const fileName = `${req.protocol}://${req.hostname}/files/${req.file.originalname.replace(' ', "%20")}`
    res.send({
        fileName
    })
})

module.exports = app