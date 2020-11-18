const express = require('express')
const app = express.Router()
const db = require('../../../controller/Overview/dbController')
const passport = require('../../../middleware/authorizationMiddleware')
const routeErrorHandler = require('../../../middleware/errorMiddleware')

app.use(passport.authenticate('bearer', { session: false }))

app.post('/movie-detail/:movie_id', async (req, res, next) => {
    const movieId = req.body.movie_id
 
    const isOverviewed = await db.get("overview", { movieId })
        .catch((err) => next(err))
    
        if (isOverviewed && isOverviewed.length) {
            res.status(406).send('Movie already has overview')
            return;
        }
    const addOverview = await db.add("overview", req.body)
        .catch((err) => {
            next(err)
        })       
    if (addOverview) { 
        res.send(addOverview)
    }
    
});


app.use(routeErrorHandler)

module.exports = app
