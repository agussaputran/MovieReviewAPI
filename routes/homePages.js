const express = require('express')
const paginate = require('express-paginate')
const app = express.Router()
const db = require('../controller/Home/dbController')
const mysqlErrorHandler = require('../middleware/errorMiddleware')

app.get('/home', paginate.middleware(8, 15), async (req, res, next) => {
    const offset = (req.query.page - 1) * req.query.limit
    const id = "movies.id"
    const config = {
        order: 'ORDER BY title',
        limit: `limit ${req.query.limit}`,
        offset: `offset ${offset}`
    }

    const result = await db.getPaginate(config)
        .catch((err) => next(err))
    const itemCount = await db.countData(id, 'movies')
        .catch((err) => next(err))
    const totalCount = itemCount[0].total
    const pageCount = Math.ceil(totalCount / req.query.limit);

    const response = {
        movies: result,
        pages: paginate.getArrayPages(req)(10, pageCount, req.query.page)
    }
    res.send(response);
})

app.use(mysqlErrorHandler)

module.exports = app
