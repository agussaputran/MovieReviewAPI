const express = require('express')
const app = express.Router()
const db = require('../../../controller/Movies/dbController')
const passport = require('../../../middleware/authorizationMiddleware')
const routeErrorHandler = require('../../../middleware/errorMiddleware')

app.use(passport.authenticate('bearer', { session: false }))

app.post('/admin/movies', async (req, res, next) => {
    const title = req.body.title

    const isMovieExist = await db.get('movies', { title })
        .catch(err => {
            next(err)
        })
    if (isMovieExist && isMovieExist.length) {
        return res.status(409).send('Oops! the movie already exist')
    }
    const addMovies = await db.add('movies', req.body)
        .catch(err => {
            next(err)
        })
    if (addMovies) {
        res.send(addMovies)
    }
})

app.use(routeErrorHandler)

module.exports = app