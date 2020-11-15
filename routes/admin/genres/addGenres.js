const express = require('express')
const app = express.Router()
const db = require('../../../controller/actorsAndGenres/dbController')
const passport = require('../../../middleware/authorizationMiddleware')
const routeErrorHandler = require('../../../middleware/errorMiddleware')

app.use(passport.authenticate('bearer', { session: false }))

app.post('/admin/genres', async (req, res, next) => {
    const name = req.body.name

    const isGenreExists = await db.get('genres', { name })
        .catch(err => {
            next(err)
        })
    if (isGenreExists && isGenreExists.length) {
        return res.status(409).send('Failed! Name Already Taken')
    }
    const addGenre = await db.add('genres', req.body)
        .catch(err => {
            next(err)
        })
    if (addGenre) {
        res.send(addGenre)
    }
})

app.use(routeErrorHandler)

module.exports = app
