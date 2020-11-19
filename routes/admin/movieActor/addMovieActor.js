const express = require('express')
const app = express.Router()
const db = require('../../../controller/authOrCanUseGlobal/dbController')
const passport = require('../../../middleware/authorizationMiddleware')
const routeErrorHandler = require('../../../middleware/errorMiddleware')

app.use(passport.authenticate('bearer', { session: false }))

app.post('/admin/movieActor', async (req, res, next) => {
    const actorId = req.body.actorId
    const movieId = req.body.movieId

    const movieGenre = {
        movieId,
        actorId
    }
    const addMovieActor = await db.add('movieActors', movieGenre)
        .catch(err => {
            next(err)
        })
    if (addMovieActor) {
        res.send(addMovieActor)
    }
})

app.use(routeErrorHandler)

module.exports = app
