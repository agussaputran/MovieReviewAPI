const express = require('express')
const app = express.Router()
const db = require('../../../controller/actorsAndGenres/dbController')
const passport = require('../../../middleware/authorizationMiddleware')
const routeErrorHandler = require('../../../middleware/errorMiddleware')

app.use(passport.authenticate('bearer', { session: false }))

app.delete('/admin/actors', async (req, res, next) => {
    const id = req.body.id

    const removeActor = await db.remove('actors', id)
        .catch(err => {
            next(err)
        })
    if (removeActor) {
        res.send("Remove Actor Successfully")
    }
})

app.use(routeErrorHandler)

module.exports = app
