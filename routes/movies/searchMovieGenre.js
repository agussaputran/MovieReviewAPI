const express = require('express')
const paginate = require('express-paginate')
const app = express.Router()
const db = require('../../controller/Movies/getMovieGenre')
const mysqlErrorHandler = require('../../middleware/errorMiddleware')
const passport = require('../../middleware/authorizationMiddleware')

app.use(passport.authenticate('bearer', { session: false }))

app.get('/movies/searchByGenre', async (req, res, next) => {
    const genre = req.query.genre

    const result = await db.getGenre(genre)
        .catch((err) =>
            next(err))
    if (result.length > 0) {
        res.send(result)
    } else {
        res.status(404).send('Movies not found')
    }
})


app.use(mysqlErrorHandler)

module.exports = app
