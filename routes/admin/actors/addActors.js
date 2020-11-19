const express = require('express')
const app = express.Router()
const db = require('../../../controller/actorsAndGenres/dbController')
const passport = require('../../../middleware/authorizationMiddleware')
const routeErrorHandler = require('../../../middleware/errorMiddleware')

app.use(passport.authenticate('bearer', { session: false }))

app.post('/admin/actors', async (req, res, next) => {
    const name = req.body.name

    const isActorNameExists = await db.get('actors', { name })
        .catch(err => {
            next(err)
        })
    if (isActorNameExists && isActorNameExists.length) {
        return res.status(409).send('Failed! Name Already Taken')
    }
    const addActors = await db.add('actors', req.body)
        .catch(err => {
            next(err)
        })
    if (addActors) {
        res.send(addActors)
    }
})

app.use(routeErrorHandler)

module.exports = app
