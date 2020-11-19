const express = require('express')
const app = express.Router()
const db = require('../../../controller/authOrCanUseGlobal/dbController')
const passport = require('../../../middleware/authorizationMiddleware')
const routeErrorHandler = require('../../../middleware/errorMiddleware')

app.use(passport.authenticate('bearer', { session: false }))

app.post('/admin/movieInfo', async (req, res, next) => {
    // const body = req.body
    const moviesId = req.body.moviesId
    // console.log(movieId)

    const isMovieInfoAvailable = await db.get("movieInfo", { moviesId })
        .catch((err) => next(err))

    if (isMovieInfoAvailable && isMovieInfoAvailable.length) {
        res.status(406).send('This Movie already has info')
        return;
    }
    const addMovieInfo = await db.add("movieInfo", req.body)
        .catch((err) => {
            next(err)
        })
    if (addMovieInfo) {
        res.send(addMovieInfo)
    }

});


app.use(routeErrorHandler)

module.exports = app
