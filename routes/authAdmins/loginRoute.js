const express = require('express')
const app = express.Router()
const db = require('../../controller/authOrCanUseGlobal/dbController')
const jwt = require('jsonwebtoken')
const routeErrorHandler = require('../../middleware/errorMiddleware')
const { checkPassword } = require('../../helper/bcryptHelper')
const secret = process.env.JWT_SECRET


app.post('/authAdmins/login', async (req, res, next) => {
  const username = req.body.username
  const password = req.body.password
  let userAdmin;

  const result = await db.get('userAdmins', { username })
    .catch(err => next(err))
  if (result.length) {
    userAdmin = result[0]
    const isPasswordMatch = await checkPassword(password, userAdmin.password)
      .catch(err => next(err))
    if (isPasswordMatch) {
      const token = jwt.sign(userAdmin, secret, {
        expiresIn: '7d'
      })
      userAdmin.token = token
      res.send(userAdmin)
    } else {
      res.status(401).send('Unauthorized')
    }
  } else {
    res.status(401).send('Unauthorized')
  }
})


app.use(routeErrorHandler)

module.exports = app