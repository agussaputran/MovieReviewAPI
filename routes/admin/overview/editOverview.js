const express = require('express')
const app = express.Router()
const db = require('../../../controller/Overview/dbController')
const passport = require('../../../middleware/authorizationMiddleware')
const routeErrorHandler = require('../../../middleware/errorMiddleware')

app.use(passport.authenticate('bearer', { session: false }))

app.patch('/movie-detail/:overview_id', async (req, res, next) => {
    const id = req.params.overview_id
    const body = req.body
    console.log(body);
    const editReview = await db.edit("overview", id, body)
        .catch((err) => next(err))
    try {
        if (editReview) {
            const body = await db.get("overview", { id: req.params.overview_id })
                .catch((err) => next(err))
            res.status(200).send(body);
        } else {
            res.send("Wrong Body");
        }
    } catch (err) {
        res.send(err);
    }
})



app.use(routeErrorHandler)

module.exports = app
