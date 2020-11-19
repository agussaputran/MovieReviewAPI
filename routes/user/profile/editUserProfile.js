const express = require('express')
// const upload = require('../../../controller/Users/uploadPhotoController')
const app = express.Router()
const db = require('../../../controller/Users/userController')
// const upload = require('../../../helper/imageUploaderHelper')
const passport = require('../../../middleware/authorizationMiddleware')
const routeErrorHandler = require('../../../middleware/errorMiddleware')

app.use(passport.authenticate('bearer', { session: false }))

app.patch('/user', async (req, res, next) => {
    const id = req.body.id
    const body = req.body
    const editUser = await db.editUsers('users', id, body)
        .catch(err => {
            next(err)
        })
    if (editUser) {
        res.send(editUser)
    }
})

app.use(routeErrorHandler)

module.exports = app
