const express = require('express')
const app = express.Router()
const db = require('../../../controller/actorsAndGenres/dbController')
const passport = require('../../../middleware/authorizationMiddleware')
const routeErrorHandler = require('../../../middleware/errorMiddleware')

app.use(passport.authenticate('bearer', { session: false }))

app.patch('/admin/genres', async (req, res, next) => {
    const id = req.body.id
    const body = req.body
    const editGenre = await db.edit('genres', id, body)
        .catch(err => {
            next(err)
        })
    if (editGenre) {
        res.send(editGenre)
    }
})


app.use(routeErrorHandler)

module.exports = app
