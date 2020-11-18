const express = require('express')
const app = express.Router()
const db = require('../controller/Users/userController')
// const upload = require('../../helper/imageUploaderHelper')
// const passport = require('../../middleware/authorizationMiddleware')
const routeErrorHandler = require('../middleware/errorMiddleware')

// app.use(passport.authenticate('bearer', { session: false }))

// get all user
app.get('/users', async (req, res, next) => {
    const query = req.query
    // const id = req.user.id
    // query.id = id
    const result = await db.getUsers('users', query)
        .catch(err => {
            next(err)
        })
    res.send(result)
})

// get spesifik user
app.get('/users/:user_id', async (req, res, next) => {
    const query = req.query
    const userId = req.params.user_id
    const body = req.body
    query.userId = body
    console.log(body);
    const getUser = await db.getUsers('users', body)
        .catch((err) => next(err))
        
    if (getUser.length) {
        res.status(200).send(getUser);
    } else {
        res.send("Data is not found");
    }
    
})

app.use(routeErrorHandler)

module.exports = app