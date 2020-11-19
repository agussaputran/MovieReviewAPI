const express = require('express')
const app = express.Router()
const db = require('../../../controller/movieInfo/dbController')
const passport = require('../../../middleware/authorizationMiddleware')
const routeErrorHandler = require('../../../middleware/errorMiddleware')

app.use(passport.authenticate('bearer', { session: false }))

app.post('/movie-detail/info/:movie_id', async (req, res, next) => {
    const body = req.body
    body.movies_id = req.params.movie_id
    // console.log(movieId)
 
    const isMovieInfoAvailable = await db.get("movieinfo", { movies_id: req.body.movies_id })
        .catch((err) => next(err))
    
        if (isMovieInfoAvailable && isMovieInfoAvailable.length) {
            res.status(406).send('This Movie already has info')
            return;
        }
    const addMovieInfo = await db.add("movieinfo", req.body)
        .catch((err) => {
            next(err)
        })       
    if (addMovieInfo) { 
        res.send(addMovieInfo)
    }
    
});


app.use(routeErrorHandler)

module.exports = app
