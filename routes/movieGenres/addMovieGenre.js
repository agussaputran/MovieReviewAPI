const express = require('express')
const app = express.Router()
const db = require('../../controller/movieGenres/dbController')
const passport = require('../../middleware/authorizationMiddleware')
const routeErrorHandler = require('../../middleware/errorMiddleware')

app.use(passport.authenticate('bearer', { session: false }))

app.post('/movieGenres', async (req, res, next) => {
    const movieId = req.movies.id
    const genreId = req.genres.id

    const isMovieIdExist = await db.get('movies', { movieId })
        .catch(err => {
            next(err)
        })
    if (!isMovieIdExist) {
        return res.status(409).send('Movie not found')
    }
    const isGenreIdExist = await db.get('genres', { genreId })
        .catch(err => {
            next(err)
        })
    if (!isGenreIdExist) {
        return res.status(409).send('Genre not found')
    }

    const addMovieGenre = await db.add('movieGenres', req.body)
        .catch(err => {
            next(err)
        })
    if (addMovieGenre) {
        res.send(addMovieGenre)
    }
})

app.use(routeErrorHandler)

module.exports = app
