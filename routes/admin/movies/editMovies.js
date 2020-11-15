const express = require('express')
const app = express.Router()
const db = require('../../../controller/Movies/dbController')
const passport = require('../../../middleware/authorizationMiddleware')
const routeErrorHandler = require('../../../middleware/errorMiddleware')

app.use(passport.authenticate('bearer', { session: false }))

app.patch('/admin/movies', async (req, res, next) => {
    const id = req.body.id
    const body = req.body
    const title = req.body.title

    const isMovieExist = await db.get('movies', { title })
        .catch(err => {
            next(err)
        })
    if (isMovieExist && isMovieExist.length) {
        res.status(409).send('Oops! the movie already exist')
    }
    const editMovies = await db.edit('movies', id, body)
        .catch(err => {
            next(err)
        })
    if (editMovies) {
        res.send(editMovies)
    }
})

app.use(routeErrorHandler)

module.exports = app