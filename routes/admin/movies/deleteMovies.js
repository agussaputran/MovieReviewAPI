const express = require('express')
const app = express.Router()
const db = require('../../../controller/Movies/dbController')
const passport = require('../../../middleware/authorizationMiddleware')
const routeErrorHandler = require('../../../middleware/errorMiddleware')

app.use(passport.authenticate('bearer', { session: false }))

app.post('/admin/movies', async (req, res, next) => {
    const id = req.body.id

    const isMovieExist = await db.get('movies', { id })
        .catch(err => {
            next(err)
        })
    if (!isMovieExist) {
        res.status(409).send('Movie not found')
    }
    const removeMovies = await db.add('movies', id)
        .catch(err => {
            next(err)
        })
    if (removeMovies) {
        res.send("Movie has been removed")
    }
})

app.use(routeErrorHandler)

module.exports = app