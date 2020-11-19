const express = require('express')
const app = express.Router()
const db = require('../../../controller/movieGenres/dbController')
const passport = require('../../../middleware/authorizationMiddleware')
const routeErrorHandler = require('../../../middleware/errorMiddleware')

app.use(passport.authenticate('bearer', { session: false }))

app.delete('/admin/movieGenres', async (req, res, next) => {
    const id = req.query.id

    const delMovieGenre = await db.remove('movieGenre', id)
        .catch(err => {
            next(err)
        })
    if (delMovieGenre) {
        res.send("OK")
    }
})

app.use(routeErrorHandler)

module.exports = app
