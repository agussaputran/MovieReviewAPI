const express = require('express')
const app = express.Router()
const db = require('../../../controller/movieGenres/dbController')
const passport = require('../../../middleware/authorizationMiddleware')
const routeErrorHandler = require('../../../middleware/errorMiddleware')

app.use(passport.authenticate('bearer', { session: false }))

app.post('/admin/movieGenres', async (req, res, next) => {
    const genreId = req.body.genreId
    const moviesId = req.body.moviesId

    const movieGenre = {
        moviesId,
        genreId
    }
    const addMovieGenre = await db.add('movieGenre', movieGenre)
        .catch(err => {
            next(err)
        })
    if (addMovieGenre) {
        res.send(addMovieGenre)
    }
})

app.use(routeErrorHandler)

module.exports = app
