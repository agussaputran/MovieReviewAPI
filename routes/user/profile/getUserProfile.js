const express = require('express')
const routeErrorHandler = require("../../../middleware/errorMiddleware")
const passport = require('../../../middleware/authorizationMiddleware')
const { getUsers } = require('../../../controller/Users/userController')
const app = express.Router()

app.get('/user', passport.authenticate('bearer', { session: false }), async (req, res, next) => {
    let body = req.body
    const id = req.user.id
    body.id = id
    const result = await getUsers('users', body)
        .catch(err => next(err))
    res.send(result)
})

app.use(routeErrorHandler)

module.exports = app;
