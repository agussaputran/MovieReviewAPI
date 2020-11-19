const express = require('express')
const app = express.Router()
const db = require('../../../controller/Overview/dbController')
const passport = require('../../../middleware/authorizationMiddleware')
const routeErrorHandler = require('../../../middleware/errorMiddleware')

app.use(passport.authenticate('bearer', { session: false }))

app.delete('/movie-detail/:overview_id', async (req, res, next) => {
    const id = req.body.id

    const removeOverview = await db.remove('overview', id)
        .catch(err => {
            next(err)
        })
    if (removeOverview) {
        res.send("Successfully Removing The Genre")
    }
})


app.use(routeErrorHandler)

module.exports = app
