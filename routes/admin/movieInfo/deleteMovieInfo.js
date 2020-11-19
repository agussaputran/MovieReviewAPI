const express = require('express')
const app = express.Router()
const db = require('../../../controller/movieInfo/dbController')
const passport = require('../../../middleware/authorizationMiddleware')
const routeErrorHandler = require('../../../middleware/errorMiddleware')

app.use(passport.authenticate('bearer', { session: false }))

app.delete('/movie-detail/info/:movieinfo_id', async (req, res, next) => {
    const id = req.params.movieinfo_id

    const removeMovieinfo = await db.remove('movieinfo', id)
        .catch(err => {
            next(err)
        })
    if (removeMovieinfo) {
        res.send("Successfully Removing The Movie Info")
    }
})


app.use(routeErrorHandler)

module.exports = app
