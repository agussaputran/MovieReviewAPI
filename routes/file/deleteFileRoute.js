const express = require('express')
const app = express.Router()
const fs = require('fs')
const path = require('path')

app.delete('/file', (req, res) => {
    fs.unlink(path.resolve('uploads', req.query.fileName), (err) => {
        if (err)
            res.status(404).send('not found')
        else
            res.send("ok")
    })
})

module.exports = app