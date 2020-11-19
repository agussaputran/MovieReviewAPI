const express = require('express')
const app = express.Router()
const db = require('../../../controller/authOrCanUseGlobal/dbController')
const passport = require('../../../middleware/authorizationMiddleware')
const routeErrorHandler = require('../../../middleware/errorMiddleware')

app.use(passport.authenticate('bearer', { session: false }))

app.patch('/admin/movieInfo', async (req, res, next) => {
    const id = req.params.movieinfo_id
    console.log(id);
    const body = req.body
    console.log(body);
    const editMovieInfo = await db.edit(" movieinfo", id, body)
        .catch((err) => next(err))
    // console.log(id)
    try {
        if (editMovieInfo) {
            const body = await db.get(" movieinfo", { id: req.params.movieinfo_id })
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
