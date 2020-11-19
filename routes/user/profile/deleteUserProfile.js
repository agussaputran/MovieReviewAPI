const express = require('express')
const app = express.Router()
const db = require('../../../controller/Users/userController')
const passport = require('../../../middleware/authorizationMiddleware')
const routeErrorHandler = require('../../../middleware/errorMiddleware')

app.use(passport.authenticate('bearer', { session: false }))

app.delete('/user/profile', (req, res, next) => {
    const id = req.body.id
    db.removeUsers('users', id)
        .then(() => {
            res.send("Your account is successfully deleted")
        })
        .catch(err => {
            next(err)
        })
})

app.use(routeErrorHandler)

module.exports = app
