const express = require('express')
const app = express.Router()
const db = require('../../../controller/actorsAndGenres/dbController')
const passport = require('../../../middleware/authorizationMiddleware')
const routeErrorHandler = require('../../../middleware/errorMiddleware')

app.use(passport.authenticate('bearer', { session: false }))

app.delete('/admin/genres', async (req, res, next) => {
    const id = req.body.id

    const removeGenre = await db.remove('genres', id)
        .catch(err => {
            next(err)
        })
    if (removeGenre) {
        res.send("Remove Actor Successfully")
    }
})


app.use(routeErrorHandler)

module.exports = app
