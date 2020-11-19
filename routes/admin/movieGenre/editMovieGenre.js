const express = require('express')
const app = express.Router()
const db = require('../../../controller/movieGenres/dbController')
const passport = require('../../../middleware/authorizationMiddleware')
const routeErrorHandler = require('../../../middleware/errorMiddleware')

app.use(passport.authenticate('bearer', { session: false }))

app.patch('/admin/movieGenres', async (req, res, next) => {
    const id = req.body.id
    const body = req.body

    const editMovieGenre = await db.edit('movieGenre', id, body)
        .catch(err => {
            next(err)
        })
    if (editMovieGenre) {
        res.send(editMovieGenre)
    }
})

app.use(routeErrorHandler)

module.exports = app
