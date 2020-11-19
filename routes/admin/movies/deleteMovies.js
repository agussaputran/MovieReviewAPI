const express = require('express')
const app = express.Router()
const db = require('../../../controller/Movies/dbController')
const passport = require('../../../middleware/authorizationMiddleware')
const routeErrorHandler = require('../../../middleware/errorMiddleware')

app.use(passport.authenticate('bearer', { session: false }))

app.delete('/admin/movies', async (req, res, next) => {
    const id = req.body.id

    const removeMovies = await db.remove('movies', id)
        .catch(err => {
            next(err)
        })
    if (removeMovies) {
        res.send("Movie has been removed")
    }
})

app.use(routeErrorHandler)

module.exports = app